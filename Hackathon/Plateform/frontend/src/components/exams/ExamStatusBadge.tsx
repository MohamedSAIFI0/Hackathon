import React from 'react';
import { Exam } from '../../types/exam';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CalendarClock 
} from 'lucide-react';

interface ExamStatusBadgeProps {
  status: Exam['status'];
  className?: string;
}

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ 
  status,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'scheduled':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <CalendarClock className="w-4 h-4 mr-1" />,
          label: 'Planifié'
        };
      case 'in-progress':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <Clock className="w-4 h-4 mr-1 animate-pulse" />,
          label: 'En cours'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
          label: 'Terminé'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle className="w-4 h-4 mr-1" />,
          label: 'Annulé'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: null,
          label: status
        };
    }
  };

  const { color, icon, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}>
      {icon}
      {label}
    </span>
  );
};