import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetResource } from '../hooks/useFhir';
import { Patient } from '../types/fhir';
import { User, Calendar, MapPin, Phone, Mail, Heart, ArrowLeft } from 'lucide-react';
import FhirResourceViewer from './FhirResourceViewer';
import PatientObservations from './PatientObservations';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, loading, error, execute } = useGetResource<Patient>('Patient', id || '');

  useEffect(() => {
    if (id) {
      execute();
    }
  }, [id, execute]);

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
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Patient</h2>
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

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-600 text-center">No patient data available</p>
      </div>
    );
  }

  const getName = () => {
    if (!patient.name || patient.name.length === 0) return 'Unknown Patient';
    
    const name = patient.name[0];
    const given = name.given?.join(' ') || '';
    const family = name.family || '';
    
    return `${given} ${family}`.trim() || 'Unknown Patient';
  };

  const getAddress = () => {
    if (!patient.address || patient.address.length === 0) return 'No address on file';
    
    const address = patient.address[0];
    const line = address.line?.join(', ') || '';
    const city = address.city || '';
    const state = address.state || '';
    const postalCode = address.postalCode || '';
    
    return `${line}, ${city}, ${state} ${postalCode}`.replace(/^, /, '').replace(/, , /, ', ');
  };

  const getPhone = () => {
    if (!patient.telecom || patient.telecom.length === 0) return 'No phone on file';
    
    const phone = patient.telecom.find(t => t.system === 'phone');
    return phone?.value || 'No phone on file';
  };

  const getEmail = () => {
    if (!patient.telecom || patient.telecom.length === 0) return 'No email on file';
    
    const email = patient.telecom.find(t => t.system === 'email');
    return email?.value || 'No email on file';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft size={16} className="mr-1" /> Back to Patient Search
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full mr-4">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{getName()}</h1>
              <p className="text-blue-100">
                ID: {patient.id || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                  <p className="text-gray-800">{patient.birthDate || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Heart className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Gender</p>
                  <p className="text-gray-800">
                    {patient.gender 
                      ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) 
                      : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Address</p>
                  <p className="text-gray-800">{getAddress()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-800">{getPhone()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-gray-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800">{getEmail()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {id && <div className="mt-6"><PatientObservations patientId={id} /></div>}
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Raw FHIR Resource</h2>
        <FhirResourceViewer resource={patient} />
      </div>
    </div>
  );
};

export default PatientDetail;