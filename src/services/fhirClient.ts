import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Resource, 
  ResourceType, 
  Bundle, 
  SearchParams, 
  FhirError,
  Patient,
  Observation
} from '../types/fhir';

export type FhirServerType = 'kodjin' | 'hapi' | 'custom';
export type AuthType = 'none' | 'basic' | 'bearer' | 'client_credentials';

export interface FhirServerConfig {
  type: FhirServerType;
  baseUrl: string;
  name: string;
  authType?: AuthType;
  authData?: {
    username?: string;
    password?: string;
    token?: string;
    clientId?: string;
    clientSecret?: string;
    tokenUrl?: string;
  };
}

export const FHIR_SERVERS: Record<FhirServerType, FhirServerConfig> = {
  kodjin: {
    type: 'kodjin',
    baseUrl: 'https://demo.kodjin.com/fhir', 
    name: 'Kodjin FHIR Server',
    authType: 'none'
  },
  hapi: {
    type: 'hapi',
    baseUrl: 'https://hapi.fhir.org/baseR4',
    name: 'HAPI FHIR Server',
    authType: 'none'
  },
  custom: {
    type: 'custom',
    baseUrl: '',
    name: 'Custom FHIR Server',
    authType: 'none'
  }
};

class FhirClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private serverConfig: FhirServerConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(serverConfig: FhirServerConfig = FHIR_SERVERS.kodjin) {
    this.baseUrl = serverConfig.baseUrl;
    this.serverConfig = serverConfig;
    this.client = this.createClient();
  }

  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      }
    });

    // Add request interceptor for authentication
    client.interceptors.request.use(
      async (config) => {
        // Add authentication headers if needed
        if (this.serverConfig.authType === 'basic' && 
            this.serverConfig.authData?.username && 
            this.serverConfig.authData?.password) {
          const auth = btoa(`${this.serverConfig.authData.username}:${this.serverConfig.authData.password}`);
          config.headers['Authorization'] = `Basic ${auth}`;
        } else if (this.serverConfig.authType === 'bearer' && this.serverConfig.authData?.token) {
          config.headers['Authorization'] = `Bearer ${this.serverConfig.authData.token}`;
        } else if (this.serverConfig.authType === 'client_credentials') {
          // Check if we need to get a new token
          if (!this.accessToken || (this.tokenExpiry && Date.now() > this.tokenExpiry)) {
            await this.getOAuthToken();
          }
          if (this.accessToken) {
            config.headers['Authorization'] = `Bearer ${this.accessToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    client.interceptors.response.use(
      (response) => response,
      (error) => {
        const fhirError: FhirError = {
          status: error.response?.status || 500,
          message: error.response?.data?.issue?.[0]?.diagnostics || error.message
        };
        
        if (error.response?.data?.issue) {
          fhirError.issue = error.response.data.issue;
        }
        
        return Promise.reject(fhirError);
      }
    );

    return client;
  }

  // Get OAuth token for client credentials flow
  private async getOAuthToken(): Promise<void> {
    if (this.serverConfig.authType !== 'client_credentials' || 
        !this.serverConfig.authData?.clientId || 
        !this.serverConfig.authData?.clientSecret ||
        !this.serverConfig.authData?.tokenUrl) {
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.serverConfig.authData.clientId);
      params.append('client_secret', this.serverConfig.authData.clientSecret);

      const response = await axios.post(this.serverConfig.authData.tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        // Set token expiry if expires_in is provided (in seconds)
        if (response.data.expires_in) {
          this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        }
      }
    } catch (error) {
      console.error('Error getting OAuth token:', error);
      this.accessToken = null;
      this.tokenExpiry = null;
    }
  }

  // Get server configuration
  getServerConfig(): FhirServerConfig {
    return this.serverConfig;
  }

  // Change FHIR server
  setServer(serverConfig: FhirServerConfig): void {
    this.baseUrl = serverConfig.baseUrl;
    this.serverConfig = serverConfig;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.client = this.createClient();
  }

  // Update authentication settings
  setAuthentication(authType: AuthType, authData?: FhirServerConfig['authData']): void {
    this.serverConfig = {
      ...this.serverConfig,
      authType,
      authData
    };
    this.accessToken = null;
    this.tokenExpiry = null;
    this.client = this.createClient();
  }

  // Get a specific resource by ID
  async getResourceById<T extends Resource>(resourceType: ResourceType, id: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(`/${resourceType}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get a resource by direct URL
  async getResourceByUrl<T extends Resource>(url: string): Promise<T> {
    try {
      // If the URL is from the same server, use the relative path
      if (url.startsWith(this.baseUrl)) {
        const relativePath = url.substring(this.baseUrl.length);
        const response: AxiosResponse<T> = await this.client.get(relativePath);
        return response.data;
      } else {
        // For external URLs, make a direct request
        const response: AxiosResponse<T> = await axios.get(url, {
          headers: {
            'Accept': 'application/fhir+json'
          }
        });
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  // Search for resources
  async searchResources<T extends Resource>(
    resourceType: ResourceType, 
    params: SearchParams = {}
  ): Promise<Bundle> {
    try {
      const searchParams = new URLSearchParams();
      
      // Convert params object to URLSearchParams
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
      
      const response: AxiosResponse<Bundle> = await this.client.get(
        `/${resourceType}`, 
        { params: searchParams }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new resource
  async createResource<T extends Resource>(resource: T): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(
        `/${resource.resourceType}`, 
        resource
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing resource
  async updateResource<T extends Resource>(resource: T): Promise<T> {
    if (!resource.id) {
      throw new Error('Resource ID is required for updates');
    }
    
    try {
      const response: AxiosResponse<T> = await this.client.put(
        `/${resource.resourceType}/${resource.id}`, 
        resource
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete a resource
  async deleteResource(resourceType: ResourceType, id: string): Promise<void> {
    try {
      await this.client.delete(`/${resourceType}/${id}`);
    } catch (error) {
      throw error;
    }
  }

  // Helper method to get patients with various search parameters
  async searchPatients(params: SearchParams = {}): Promise<Bundle> {
    return this.searchResources('Patient', params);
  }

  // Get a specific patient by ID
  async getPatient(id: string): Promise<Patient> {
    return this.getResourceById<Patient>('Patient', id);
  }

  // Helper method to get observations
  async searchObservations(params: SearchParams = {}): Promise<Bundle> {
    return this.searchResources('Observation', params);
  }

  // Get observations for a specific patient
  async getPatientObservations(patientId: string): Promise<Bundle> {
    return this.searchResources<Observation>('Observation', { patient: patientId });
  }

  // Get a specific observation by ID
  async getObservation(id: string): Promise<Observation> {
    return this.getResourceById<Observation>('Observation', id);
  }

  // Get capability statement (metadata)
  async getCapabilityStatement(): Promise<any> {
    try {
      const response = await this.client.get('/metadata');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Execute a batch or transaction bundle
  async executeBatch(bundle: Bundle): Promise<Bundle> {
    try {
      const response: AxiosResponse<Bundle> = await this.client.post('/', bundle);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Test connection to the server
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/metadata');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
const fhirClient = new FhirClient();
export default fhirClient;

// Also export the class for custom instances
export { FhirClient };