import React, { useState } from 'react';
import { Server, Lock, Unlock, X } from 'lucide-react';
import { FHIR_SERVERS, FhirServerConfig, FhirServerType, AuthType } from '../services/fhirClient';

interface ServerSelectorProps {
  currentServer: FhirServerConfig;
  onServerChange: (server: FhirServerConfig) => void;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({ currentServer, onServerChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<AuthType>(currentServer.authType || 'none');
  const [username, setUsername] = useState(currentServer.authData?.username || '');
  const [password, setPassword] = useState(currentServer.authData?.password || '');
  const [token, setToken] = useState(currentServer.authData?.token || '');
  const [clientId, setClientId] = useState(currentServer.authData?.clientId || '');
  const [clientSecret, setClientSecret] = useState(currentServer.authData?.clientSecret || '');
  const [tokenUrl, setTokenUrl] = useState(currentServer.authData?.tokenUrl || '');
  const [customUrl, setCustomUrl] = useState(currentServer.type === 'custom' ? currentServer.baseUrl : '');

  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serverType = e.target.value as FhirServerType;
    
    if (serverType === 'custom') {
      setShowAuthModal(true);
    } else {
      onServerChange(FHIR_SERVERS[serverType]);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedServer: FhirServerConfig = {
      ...currentServer,
      type: 'custom',
      baseUrl: customUrl || currentServer.baseUrl,
      name: 'Custom FHIR Server',
      authType: authType,
      authData: authType !== 'none' ? {
        username: authType === 'basic' ? username : undefined,
        password: authType === 'basic' ? password : undefined,
        token: authType === 'bearer' ? token : undefined,
        clientId: authType === 'client_credentials' ? clientId : undefined,
        clientSecret: authType === 'client_credentials' ? clientSecret : undefined,
        tokenUrl: authType === 'client_credentials' ? tokenUrl : undefined,
      } : undefined
    };
    
    onServerChange(updatedServer);
    setShowAuthModal(false);
  };

  const handleConfigureAuth = () => {
    setAuthType(currentServer.authType || 'none');
    setUsername(currentServer.authData?.username || '');
    setPassword(currentServer.authData?.password || '');
    setToken(currentServer.authData?.token || '');
    setClientId(currentServer.authData?.clientId || '');
    setClientSecret(currentServer.authData?.clientSecret || '');
    setTokenUrl(currentServer.authData?.tokenUrl || '');
    setCustomUrl(currentServer.type === 'custom' ? currentServer.baseUrl : '');
    setShowAuthModal(true);
  };

  return (
    <div className="flex items-center">
      <Server size={18} className="text-gray-500 mr-2" />
      <select
        value={currentServer.type}
        onChange={handleServerChange}
        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        {Object.values(FHIR_SERVERS).map((server) => (
          <option key={server.type} value={server.type}>
            {server.name}
          </option>
        ))}
      </select>
      
      <button 
        onClick={handleConfigureAuth}
        className="ml-2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
        title="Configure Authentication"
      >
        {currentServer.authType && currentServer.authType !== 'none' ? (
          <Lock size={16} />
        ) : (
          <Unlock size={16} />
        )}
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Configure FHIR Server</h3>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Server URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://fhir-server.example.com/fhir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authentication Type
                </label>
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value as AuthType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">No Authentication</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="client_credentials">OAuth 2.0 (Client Credentials)</option>
                </select>
              </div>
              
              {authType === 'basic' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              )}
              
              {authType === 'bearer' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bearer Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}
              
              {authType === 'client_credentials' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token URL
                    </label>
                    <input
                      type="url"
                      value={tokenUrl}
                      onChange={(e) => setTokenUrl(e.target.value)}
                      placeholder="https://auth-server.example.com/token"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerSelector;