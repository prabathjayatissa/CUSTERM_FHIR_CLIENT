import React from 'react';
import { Bundle, Patient } from '../types/fhir';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PatientListProps {
  bundle: Bundle;
}

const PatientList: React.FC<PatientListProps> = ({ bundle }) => {
  if (!bundle.entry || bundle.entry.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No patients found. Try a different search.
      </div>
    );
  }

  const formatName = (patient: Patient): string => {
    if (!patient.name || patient.name.length === 0) return 'Unknown';
    
    const name = patient.name[0];
    const given = name.given?.join(' ') || '';
    const family = name.family || '';
    
    return `${given} ${family}`.trim();
  };

  const formatIdentifier = (patient: Patient): string => {
    if (!patient.identifier || patient.identifier.length === 0) return 'No ID';
    return patient.identifier[0].value || 'No ID';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Found {bundle.total || bundle.entry.length} patient(s)
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Birth Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bundle.entry.map((entry, index) => {
              const patient = entry.resource as Patient;
              if (!patient || patient.resourceType !== 'Patient') return null;
              
              return (
                <tr key={patient.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatName(patient)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatIdentifier(patient)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.birthDate || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/patients/${patient.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;