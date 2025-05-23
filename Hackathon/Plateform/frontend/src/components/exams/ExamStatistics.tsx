import React from 'react';
import { Exam } from '../../types/exam';
import { 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CalendarCheck
} from 'lucide-react';

interface ExamStatisticsProps {
  exams: Exam[];
}

export const ExamStatistics: React.FC<ExamStatisticsProps> = ({ exams }) => {
  // Calculate statistics
  const totalExams = exams.length;
  const completedExams = exams.filter(exam => exam.status === 'completed').length;
  const scheduledExams = exams.filter(exam => exam.status === 'scheduled').length;
  const inProgressExams = exams.filter(exam => exam.status === 'in-progress').length;
  
  const totalStudents = exams.reduce((sum, exam) => sum + exam.totalStudents, 0);
  const presentStudents = exams.reduce((sum, exam) => sum + exam.presentStudents, 0);
  const averageAttendance = totalStudents > 0 
    ? Math.round((presentStudents / totalStudents) * 100) 
    : 0;
  
  const totalFraudIncidents = exams.reduce(
    (sum, exam) => sum + exam.fraudIncidents.length, 
    0
  );
  
  const fraudRatePerStudent = presentStudents > 0 
    ? (totalFraudIncidents / presentStudents) * 100 
    : 0;
  
  const statCards = [
    {
      title: 'Examens',
      value: totalExams,
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      details: `${completedExams} terminés, ${scheduledExams} planifiés`,
      color: 'bg-blue-50 border-blue-100'
    },
    {
      title: 'Participation',
      value: `${averageAttendance}%`,
      icon: <Users className="w-8 h-8 text-green-500" />,
      details: `${presentStudents} présents sur ${totalStudents} inscrits`,
      color: 'bg-green-50 border-green-100'
    },
    {
      title: 'Incidents de fraude',
      value: totalFraudIncidents,
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      details: `${fraudRatePerStudent.toFixed(2)}% des étudiants`,
      color: 'bg-red-50 border-red-100'
    },
    {
      title: 'Prochain examen',
      value: scheduledExams > 0 ? 'Planifié' : 'Aucun',
      icon: <CalendarCheck className="w-8 h-8 text-amber-500" />,
      details: scheduledExams > 0 
        ? `${scheduledExams} examens à venir` 
        : 'Aucun examen planifié',
      color: 'bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div 
          key={index}
          className={`rounded-lg border p-4 ${card.color}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="mt-1 text-xs text-gray-600">{card.details}</p>
            </div>
            <div>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};