import React, { useState, useEffect } from 'react';
import { useSearchResources } from '../hooks/useFhir';
import { useGetResource } from '../hooks/useFhir';
import { Patient, SearchParams } from '../types/fhir';
import { Search, ExternalLink } from 'lucide-react';
import PatientList from './PatientList';
import { useNavigate } from 'react-router-dom';

const PatientSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'identifier' | 'id' | 'direct'>('name');
  const [directId, setDirectId] = useState('');
  const { data, loading, error, execute } = useSearchResources<Patient>('Patient', searchParams);
  const { 
    data: directPatient, 
    loading: directLoading, 
    error: directError, 
    execute: executeDirectFetch 
  } = useGetResource<Patient>('Patient', directId);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchType !== 'direct') {
      execute();
    }
  }, [searchParams, execute, searchType]);

  useEffect(() => {
    if (directId && searchType === 'direct') {
      executeDirectFetch();
    }
  }, [directId, executeDirectFetch, searchType]);

  useEffect(() => {
    if (directPatient && directPatient.id) {
      navigate(`/patients/${directPatient.id}`);
    }
  }, [directPatient, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'direct') {
      // Extract ID from URL or use as is
      let id = searchTerm;
      
      // Handle full URLs like https://demo.kodjin.com/fhir/Patient/1
      const urlMatch = searchTerm.match(/\/Patient\/([^/]+)(?:\/|$)/);
      if (urlMatch && urlMatch[1]) {
        id = urlMatch[1];
      }
      
      setDirectId(id);
    } else {
      // Build search parameters based on the search term and type
      const newParams: SearchParams = {};
      
      if (searchTerm) {
        if (searchType === 'name') {
          newParams.name = searchTerm;
        } else if (searchType === 'identifier') {
          newParams.identifier = searchTerm;
        } else if (searchType === 'id') {
          newParams._id = searchTerm;
        }
      }
      
      setSearchParams(newParams);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Patient Search</h2>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchType === 'direct' 
                    ? "Enter URL (e.g., https://demo.kodjin.com/fhir/Patient/1) or ID" 
                    : "Enter search term..."}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {searchType === 'direct' ? (
                    <ExternalLink size={18} className="text-gray-400" />
                  ) : (
                    <Search size={18} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'name' | 'identifier' | 'id' | 'direct')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="identifier">Identifier</option>
                <option value="id">Patient ID</option>
                <option value="direct">Direct URL</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {searchType === 'direct' ? 'Go to Patient' : 'Search'}
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            {searchType === 'name' && "Search by patient's full or partial name"}
            {searchType === 'identifier' && "Search by patient's identifier (e.g., MRN, SSN)"}
            {searchType === 'id' && "Search by FHIR resource ID"}
            {searchType === 'direct' && "Enter a direct FHIR URL (e.g., https://demo.kodjin.com/fhir/Patient/1) or just the ID"}
          </div>
        </form>

        {(error || directError) && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            <p className="font-medium">Error: {(error || directError)?.message}</p>
            {(error?.issue || directError?.issue) && (
              <ul className="mt-2 list-disc list-inside">
                {(error?.issue || directError?.issue)?.map((issue, index) => (
                  <li key={index}>{issue.diagnostics}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(loading || directLoading) ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          searchType !== 'direct' && data && <PatientList bundle={data} />
        )}
      </div>
    </div>
  );
};

export default PatientSearch;