import React, { useEffect } from 'react';
import { useSearchResources } from '../hooks/useFhir';
import { Observation } from '../types/fhir';
import ObservationList from './ObservationList';

interface PatientObservationsProps {
  patientId: string;
}

const PatientObservations: React.FC<PatientObservationsProps> = ({ patientId }) => {
  const { data, loading, error, execute } = useSearchResources<Observation>(
    'Observation', 
    { patient: patientId }
  );

  useEffect(() => {
    if (patientId) {
      execute();
    }
  }, [patientId, execute]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
        <p className="font-medium">Error loading observations: {error.message}</p>
        {error.issue && (
          <ul className="mt-2 list-disc list-inside">
            {error.issue.map((issue, index) => (
              <li key={index}>{issue.diagnostics}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (!data || !data.entry || data.entry.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No observations found for this patient</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Patient Observations</h2>
      <ObservationList bundle={data} />
    </div>
  );
};

export default PatientObservations;