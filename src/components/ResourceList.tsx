import React from 'react';
import { Bundle, ResourceType, HumanName } from '../types/fhir';
import { Activity, User, Building, FileText, Heart, Pill, Stethoscope, Calendar, AlertTriangle, Syringe, FileBarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceListProps {
  bundle: Bundle;
  resourceType: ResourceType;
}

const ResourceList: React.FC<ResourceListProps> = ({ bundle, resourceType }) => {
  if (!bundle.entry || bundle.entry.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {resourceType.toLowerCase()}s found.
      </div>
    );
  }

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'Patient':
        return <User className="h-6 w-6 text-blue-500" />;
      case 'Practitioner':
        return <User className="h-6 w-6 text-green-500" />;
      case 'Organization':
        return <Building className="h-6 w-6 text-purple-500" />;
      case 'Observation':
        return <Activity className="h-6 w-6 text-cyan-500" />;
      case 'Condition':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'Medication':
        return <Pill className="h-6 w-6 text-yellow-500" />;
      case 'MedicationRequest':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'Encounter':
        return <Stethoscope className="h-6 w-6 text-indigo-500" />;
      case 'AllergyIntolerance':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'Procedure':
        return <Activity className="h-6 w-6 text-blue-500" />;
      case 'Immunization':
        return <Syringe className="h-6 w-6 text-green-500" />;
      case 'DiagnosticReport':
        return <FileBarChart className="h-6 w-6 text-purple-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatHumanName = (name: HumanName): string => {
    if (name.text) {
      return name.text;
    }

    const parts: string[] = [];
    
    if (name.prefix && name.prefix.length > 0) {
      parts.push(name.prefix.join(' '));
    }
    
    if (name.given && name.given.length > 0) {
      parts.push(name.given.join(' '));
    }
    
    if (name.family) {
      parts.push(name.family);
    }
    
    if (name.suffix && name.suffix.length > 0) {
      parts.push(name.suffix.join(' '));
    }
    
    return parts.join(' ').trim() || 'Unnamed';
  };

  const getResourceName = (resource: any): string => {
    switch (resourceType) {
      case 'Patient':
      case 'Practitioner':
        if (resource.name && resource.name.length > 0) {
          return formatHumanName(resource.name[0]);
        }
        return 'Unnamed';
      case 'Organization':
        return resource.name || 'Unnamed Organization';
      case 'Observation':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Observation';
      case 'Condition':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Condition';
      case 'Medication':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Medication';
      case 'MedicationRequest':
        return resource.medicationCodeableConcept?.text || 
               resource.medicationCodeableConcept?.coding?.[0]?.display || 
               'Unnamed Medication Request';
      case 'Encounter':
        return resource.type?.[0]?.text || 'Unnamed Encounter';
      case 'AllergyIntolerance':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Allergy';
      case 'Procedure':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Procedure';
      case 'Immunization':
        return resource.vaccineCode?.text || 
               resource.vaccineCode?.coding?.[0]?.display || 
               'Unnamed Immunization';
      case 'DiagnosticReport':
        return resource.code?.text || resource.code?.coding?.[0]?.display || 'Unnamed Report';
      default:
        return 'Unnamed Resource';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Found {bundle.total || bundle.entry.length} {resourceType.toLowerCase()}(s)
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bundle.entry.map((entry, index) => {
              const resource = entry.resource;
              if (!resource) return null;
              
              return (
                <tr key={resource.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getResourceIcon(resource.resourceType)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getResourceName(resource)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resource.resourceType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.meta?.lastUpdated ? new Date(resource.meta.lastUpdated).toLocaleString() : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (resource as any).status === 'active' ? 'bg-green-100 text-green-800' :
                      (resource as any).status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(resource as any).status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/${resource.resourceType.toLowerCase()}/${resource.id}`}
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

export default ResourceList;