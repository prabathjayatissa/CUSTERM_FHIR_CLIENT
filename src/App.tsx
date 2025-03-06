import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Activity } from 'lucide-react';
import ResourceDetail from './components/ResourceDetail';
import ServerSelector from './components/ServerSelector';
import ResourceSearch from './components/ResourceSearch';
import fhirClient, { FHIR_SERVERS, FhirServerConfig } from './services/fhirClient';

function App() {
  const [currentServer, setCurrentServer] = React.useState<FhirServerConfig>(FHIR_SERVERS.kodjin);

  const handleServerChange = (server: FhirServerConfig) => {
    fhirClient.setServer(server);
    setCurrentServer(server);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FHIR Browser</span>
              </div>
              <div className="flex items-center">
                <ServerSelector 
                  currentServer={currentServer} 
                  onServerChange={handleServerChange} 
                />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ResourceSearch />} />
            <Route path="/:type/:id" element={<ResourceDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;