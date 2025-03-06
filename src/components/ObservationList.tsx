import React from 'react';
import { Bundle, Observation } from '../types/fhir';
import { Activity } from 'lucide-react';

interface ObservationListProps {
  bundle: Bundle;
}

const ObservationList: React.FC<ObservationListProps> = ({ bundle }) => {
  if (!bundle.entry || bundle.entry.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No observations found for this patient.
      </div>
    );
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getObservationValue = (observation: Observation): string => {
    if (observation.valueQuantity) {
      return `${observation.valueQuantity.value} ${observation.valueQuantity.unit || ''}`;
    } else if (observation.valueCodeableConcept) {
      return observation.valueCodeableConcept.text || 
        observation.valueCodeableConcept.coding?.[0]?.display || 
        'Coded Value';
    } else if (observation.valueString) {
      return observation.valueString;
    } else if (observation.valueBoolean !== undefined) {
      return observation.valueBoolean ? 'Yes' : 'No';
    } else if (observation.valueInteger !== undefined) {
      return observation.valueInteger.toString();
    } else if (observation.component && observation.component.length > 0) {
      return 'Multiple Components';
    } else {
      return 'No Value';
    }
  };

  const getObservationName = (observation: Observation): string => {
    return observation.code.text || 
      observation.code.coding?.[0]?.display || 
      'Unnamed Observation';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Found {bundle.total || bundle.entry.length} observation(s)
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bundle.entry.map((entry, index) => {
              const observation = entry.resource as Observation;
              if (!observation || observation.resourceType !== 'Observation') return null;
              
              return (
                <tr key={observation.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getObservationName(observation)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {observation.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {getObservationValue(observation)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(observation.effectiveDateTime || observation.issued)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      observation.status === 'final' ? 'bg-green-100 text-green-800' :
                      observation.status === 'preliminary' ? 'bg-yellow-100 text-yellow-800' :
                      observation.status === 'cancelled' || observation.status === 'entered-in-error' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {observation.status}
                    </span>
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

export default ObservationList;