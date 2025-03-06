import React from 'react';
import { Observation } from '../types/fhir';
import { Activity, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import FhirResourceViewer from './FhirResourceViewer';

interface ObservationDetailProps {
  observation: Observation;
}

const ObservationDetail: React.FC<ObservationDetailProps> = ({ observation }) => {
  if (!observation) return null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const getObservationValue = (): JSX.Element => {
    if (observation.valueQuantity) {
      return (
        <div className="text-2xl font-bold">
          {observation.valueQuantity.value} {observation.valueQuantity.unit || ''}
        </div>
      );
    } else if (observation.valueCodeableConcept) {
      return (
        <div className="text-2xl font-bold">
          {observation.valueCodeableConcept.text || 
            observation.valueCodeableConcept.coding?.[0]?.display || 
            'Coded Value'}
        </div>
      );
    } else if (observation.valueString) {
      return <div className="text-2xl font-bold">{observation.valueString}</div>;
    } else if (observation.valueBoolean !== undefined) {
      return <div className="text-2xl font-bold">{observation.valueBoolean ? 'Yes' : 'No'}</div>;
    } else if (observation.valueInteger !== undefined) {
      return <div className="text-2xl font-bold">{observation.valueInteger}</div>;
    } else if (observation.component && observation.component.length > 0) {
      return (
        <div>
          <div className="text-lg font-semibold mb-2">Multiple Components:</div>
          <div className="space-y-2">
            {observation.component.map((component, index) => (
              <div key={index} className="border-l-2 border-blue-300 pl-3">
                <div className="font-medium">{component.code.text || component.code.coding?.[0]?.display}</div>
                <div>
                  {component.valueQuantity 
                    ? `${component.valueQuantity.value} ${component.valueQuantity.unit || ''}`
                    : component.valueCodeableConcept?.text || 'No value'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return <div className="text-gray-500 italic">No value recorded</div>;
    }
  };

  const getReferenceRanges = (): JSX.Element | null => {
    if (!observation.referenceRange || observation.referenceRange.length === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Reference Ranges:</h4>
        <div className="space-y-1">
          {observation.referenceRange.map((range, index) => (
            <div key={index} className="text-sm">
              {range.text || (
                <>
                  {range.low && `Low: ${range.low.value} ${range.low.unit || ''}`}
                  {range.low && range.high && ' - '}
                  {range.high && `High: ${range.high.value} ${range.high.unit || ''}`}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4">
            <Activity size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {observation.code.text || observation.code.coding?.[0]?.display || 'Observation'}
            </h1>
            <p className="text-blue-100">
              ID: {observation.id || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          {getObservationValue()}
          {getReferenceRanges()}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="text-gray-500 mr-3 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-medium">Effective Date</p>
                <p className="text-gray-800">
                  {formatDate(observation.effectiveDateTime || observation.issued)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="text-gray-500 mr-3 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-medium">Subject</p>
                <p className="text-gray-800">
                  {observation.subject?.display || observation.subject?.reference || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Tag className="text-gray-500 mr-3 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <p className="text-gray-800 capitalize">{observation.status}</p>
              </div>
            </div>
            
            {observation.interpretation && observation.interpretation.length > 0 && (
              <div className="flex items-start">
                <AlertCircle className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Interpretation</p>
                  <p className="text-gray-800">
                    {observation.interpretation[0].text || 
                      observation.interpretation[0].coding?.[0]?.display || 
                      'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationDetail;