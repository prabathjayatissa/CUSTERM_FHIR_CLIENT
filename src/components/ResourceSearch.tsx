import React, { useState } from 'react';
import { useSearchResources } from '../hooks/useFhir';
import { ResourceType, Bundle, SearchParams } from '../types/fhir';
import { Search } from 'lucide-react';
import ResourceList from './ResourceList';

const SEARCHABLE_RESOURCES: ResourceType[] = [
  'Patient',
  'Practitioner',
  'Organization',
  'Observation',
  'Condition',
  'Medication',
  'MedicationRequest',
  'Encounter',
  'AllergyIntolerance',
  'Procedure',
  'Immunization',
  'DiagnosticReport'
];

const ResourceSearch: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<ResourceType>('Patient');
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, execute } = useSearchResources(selectedResource, searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams: SearchParams = {};
    
    if (searchTerm) {
      // Add appropriate search parameters based on resource type
      switch (selectedResource) {
        case 'Patient':
          newParams.name = searchTerm;
          break;
        case 'Practitioner':
          newParams.name = searchTerm;
          break;
        case 'Organization':
          newParams.name = searchTerm;
          break;
        case 'Observation':
          newParams.code = searchTerm;
          break;
        default:
          // Default to searching by ID if no specific search parameter is defined
          newParams._id = searchTerm;
      }
    }
    
    setSearchParams(newParams);
    execute();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">FHIR Resource Search</h2>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="md:w-48">
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value as ResourceType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SEARCHABLE_RESOURCES.map(resource => (
                  <option key={resource} value={resource}>{resource}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${selectedResource}...`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            <p className="font-medium">Error: {error.message}</p>
            {error.issue && (
              <ul className="mt-2 list-disc list-inside">
                {error.issue.map((issue, index) => (
                  <li key={index}>{issue.diagnostics}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          data && <ResourceList bundle={data} resourceType={selectedResource} />
        )}
      </div>
    </div>
  );
};

export default ResourceSearch;