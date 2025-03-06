import { useState, useCallback } from 'react';
import fhirClient from '../services/fhirClient';
import { 
  Resource, 
  ResourceType, 
  Bundle, 
  SearchParams, 
  FhirError 
} from '../types/fhir';

interface FhirState<T> {
  data: T | null;
  loading: boolean;
  error: FhirError | null;
}

interface UseFhirReturn<T> extends FhirState<T> {
  execute: () => Promise<void>;
  reset: () => void;
}

// Hook for getting a resource by ID
export function useGetResource<T extends Resource>(
  resourceType: ResourceType, 
  id: string
): UseFhirReturn<T> {
  const [state, setState] = useState<FhirState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fhirClient.getResourceById<T>(resourceType, id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error as FhirError 
      });
    }
  }, [resourceType, id]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Hook for searching resources
export function useSearchResources<T extends Resource>(
  resourceType: ResourceType,
  params: SearchParams = {}
): UseFhirReturn<Bundle> {
  const [state, setState] = useState<FhirState<Bundle>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fhirClient.searchResources<T>(resourceType, params);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error as FhirError 
      });
    }
  }, [resourceType, JSON.stringify(params)]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// Hook for creating a resource
export function useCreateResource<T extends Resource>(): {
  data: T | null;
  loading: boolean;
  error: FhirError | null;
  createResource: (resource: T) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<FhirState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const createResource = useCallback(async (resource: T) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fhirClient.createResource<T>(resource);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error as FhirError 
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, createResource, reset };
}

// Hook for updating a resource
export function useUpdateResource<T extends Resource>(): {
  data: T | null;
  loading: boolean;
  error: FhirError | null;
  updateResource: (resource: T) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<FhirState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const updateResource = useCallback(async (resource: T) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fhirClient.updateResource<T>(resource);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error as FhirError 
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, updateResource, reset };
}

// Hook for deleting a resource
export function useDeleteResource(): {
  success: boolean;
  loading: boolean;
  error: FhirError | null;
  deleteResource: (resourceType: ResourceType, id: string) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<{
    success: boolean;
    loading: boolean;
    error: FhirError | null;
  }>({
    success: false,
    loading: false,
    error: null
  });

  const deleteResource = useCallback(async (resourceType: ResourceType, id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));
    
    try {
      await fhirClient.deleteResource(resourceType, id);
      setState({ success: true, loading: false, error: null });
    } catch (error) {
      setState({ 
        success: false, 
        loading: false, 
        error: error as FhirError 
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ success: false, loading: false, error: null });
  }, []);

  return { ...state, deleteResource, reset };
}