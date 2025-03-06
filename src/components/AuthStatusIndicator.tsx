import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { FhirServerConfig } from '../services/fhirClient';

interface AuthStatusIndicatorProps {
  serverConfig: FhirServerConfig;
}

const AuthStatusIndicator: React.FC<AuthStatusIndicatorProps> = ({ serverConfig }) => {
  const isAuthenticated = serverConfig.authType && serverConfig.authType !== 'none';
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center text-gray-500 text-xs">
        <Unlock size={12} className="mr-1" />
        <span>No Auth</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-green-600 text-xs">
      <Lock size={12} className="mr-1" />
      <span>
        {serverConfig.authType === 'basic' && 'Basic Auth'}
        {serverConfig.authType === 'bearer' && 'Bearer Token'}
        {serverConfig.authType === 'client_credentials' && 'OAuth 2.0'}
      </span>
    </div>
  );
};

export default AuthStatusIndicator;