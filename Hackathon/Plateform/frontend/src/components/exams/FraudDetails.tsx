import React from 'react';
import { FraudIncident } from '../../types/exam';
import { formatDate } from '../../utils/dateFormatters';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Camera
} from 'lucide-react';

interface FraudDetailsProps {
  fraudIncidents: FraudIncident[];
}

export const FraudDetails: React.FC<FraudDetailsProps> = ({ 
  fraudIncidents 
}) => {
  if (fraudIncidents.length === 0) {
    return (
      <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        <span>Aucun incident de fraude n'a été signalé pour cet examen.</span>
      </div>
    );
  }

  const getSeverityBadge = (severity: FraudIncident['severity']) => {
    switch (severity) {
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Légère
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
            Moyenne
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Grave
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Incidents de fraude ({fraudIncidents.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 overflow-hidden bg-white">
        {fraudIncidents.map((incident) => {
          // Extract time from timestamp for display
          const date = new Date(incident.timestamp);
          const timeString = date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          return (
            <div key={incident.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{incident.studentName}</h4>
                    <span className="ml-2 text-sm text-gray-500">#{incident.studentId}</span>
                    <div className="ml-3">{getSeverityBadge(incident.severity)}</div>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600">{incident.description}</p>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{timeString}</span>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
                  {incident.evidence && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      <Camera className="w-3 h-3 mr-1" />
                      Preuve
                    </span>
                  )}
                  {incident.notes && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                      <FileText className="w-3 h-3 mr-1" />
                      Notes
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    incident.resolved 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {incident.resolved ? 'Résolu' : 'En cours'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};