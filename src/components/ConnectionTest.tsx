import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import fhirClient from '../services/fhirClient';

interface ConnectionTestProps {
  onTestComplete?: (success: boolean) => void;
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({ onTestComplete }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMessage(null);
    
    try {
      const result = await fhirClient.testConnection();
      setTestResult(result);
      if (onTestComplete) {
        onTestComplete(result);
      }
    } catch (error) {
      setTestResult(false);
      setErrorMessage('Connection error');
      if (onTestComplete) {
        onTestComplete(false);
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={testConnection}
        disabled={testing}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {testing ? (
          <span className="flex items-center">
            <Loader size={16} className="animate-spin mr-2" />
            Testing Connection...
          </span>
        ) : (
          'Test Connection'
        )}
      </button>
      
      {testResult !== null && (
        <div className={`mt-3 flex items-center ${testResult ? 'text-green-600' : 'text-red-600'}`}>
          {testResult ? (
            <>
              <CheckCircle size={16} className="mr-1" />
              <span>Connection successful</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="mr-1" />
              <span>{errorMessage || 'Connection failed'}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;