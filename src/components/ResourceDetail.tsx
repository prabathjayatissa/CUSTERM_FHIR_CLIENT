import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetResource } from '../hooks/useFhir';
import { Resource, ResourceType } from '../types/fhir';
import { ArrowLeft, Activity, User, Building, FileText, Heart, Pill, Stethoscope, Calendar, AlertTriangle, Syringe, FileBarChart } from 'lucide-react';
import FhirResourceViewer from './FhirResourceViewer';

const ResourceDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { data: resource, loading, error, execute } = useGetResource(type as ResourceType, id || '');

  useEffect(() => {
    if (type && id) {
      execute();
    }
  }, [type, id, execute]);

  const getResourceIcon = (resourceType: ResourceType) => {
    switch (resourceType) {
      case 'Patient':
        return <User className="h-8 w-8 text-blue-500" />;
      case 'Practitioner':
        return <User className="h-8 w-8 text-green-500" />;
      case 'Organization':
        return <Building className="h-8 w-8 text-purple-500" />;
      case 'Observation':
        return <Activity className="h-8 w-8 text-cyan-500" />;
      case 'Condition':
        return <Heart className="h-8 w-8 text-red-500" />;
      case 'Medication':
        return <Pill className="h-8 w-8 text-yellow-500" />;
      case 'MedicationRequest':
        return <FileText className="h-8 w-8 text-orange-500" />;
      case 'Encounter':
        return <Stethoscope className="h-8 w-8 text-indigo-500" />;
      case 'AllergyIntolerance':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      case 'Procedure':
        return <Activity className="h-8 w-8 text-blue-500" />;
      case 'Immunization':
        return <Syringe className="h-8 w-8 text-green-500" />;
      case 'DiagnosticReport':
        return <FileBarChart className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getResourceName = (resource: Resource): string => {
    switch (resource.resourceType) {
      case 'Patient':
      case 'Practitioner':
        if ((resource as any).name?.[0]) {
          const name = (resource as any).name[0];
          const parts = [];
          if (name.prefix) parts.push(name.prefix.join(' '));
          if (name.given) parts.push(name.given.join(' '));
          if (name.family) parts.push(name.family);
          if (name.suffix) parts.push(name.suffix.join(' '));
          return parts.join(' ').trim() || 'Unnamed';
        }
        return 'Unnamed';
      case 'Organization':
        return (resource as any).name || 'Unnamed Organization';
      case 'Observation':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Observation';
      case 'Condition':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Condition';
      case 'Medication':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Medication';
      case 'MedicationRequest':
        return (resource as any).medicationCodeableConcept?.text || 
               (resource as any).medicationCodeableConcept?.coding?.[0]?.display || 
               'Unnamed Medication Request';
      case 'Encounter':
        return (resource as any).type?.[0]?.text || 'Unnamed Encounter';
      case 'AllergyIntolerance':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Allergy';
      case 'Procedure':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Procedure';
      case 'Immunization':
        return (resource as any).vaccineCode?.text || 
               (resource as any).vaccineCode?.coding?.[0]?.display || 
               'Unnamed Immunization';
      case 'DiagnosticReport':
        return (resource as any).code?.text || (resource as any).code?.coding?.[0]?.display || 'Unnamed Report';
      default:
        return 'Unnamed Resource';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Resource</h2>
        <p className="text-red-600">{error.message}</p>
        {error.issue && (
          <ul className="mt-4 list-disc list-inside text-red-600">
            {error.issue.map((issue, index) => (
              <li key={index}>{issue.diagnostics}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-600 text-center">No resource data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Search
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full mr-4">
              {getResourceIcon(resource.resourceType)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{getResourceName(resource)}</h1>
              <p className="text-blue-100">
                {resource.resourceType} | ID: {resource.id}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Resource Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {resource.meta?.lastUpdated ? new Date(resource.meta.lastUpdated).toLocaleString() : 'Unknown'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-gray-900">
                  {(resource as any).status ? (
                    <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      (resource as any).status === 'active' ? 'bg-green-100 text-green-800' :
                      (resource as any).status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(resource as any).status}
                    </span>
                  ) : 'No status available'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Raw FHIR Resource</h2>
            <FhirResourceViewer resource={resource} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;