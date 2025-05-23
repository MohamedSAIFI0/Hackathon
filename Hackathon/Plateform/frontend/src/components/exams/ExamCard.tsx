import React, { useState } from 'react';
import { Exam } from '../../types/exam';
import { formatDate, formatTime, formatDuration } from '../../utils/dateFormatters';
import { ExamStatusBadge } from './ExamStatusBadge';
import { FraudBadge } from './FraudBadge';
import { FraudDetails } from './FraudDetails';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Download,
  Share2
} from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const attendanceRate = Math.round((exam.presentStudents / exam.totalStudents) * 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Card Header */}
      <div className="p-4 cursor-pointer" onClick={toggleExpand}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900 mr-3">{exam.title}</h3>
              <ExamStatusBadge status={exam.status} />
            </div>
            <div className="mt-1 text-sm text-gray-600">
              <span className="font-medium">{exam.course.code}</span> - {exam.course.name}
            </div>
          </div>

          <div className="mt-2 md:mt-0 flex items-center">
            <FraudBadge count={exam.fraudIncidents.length} className="mr-3" />
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Card Details (expanded view) */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 transition-all duration-300 ease-in-out">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Date</div>
                <div className="text-sm text-gray-900">{formatDate(exam.date)}</div>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Horaire</div>
                <div className="text-sm text-gray-900">
                  {formatTime(exam.startTime)} - {formatTime(exam.endTime)} ({formatDuration(exam.duration)})
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Lieu</div>
                <div className="text-sm text-gray-900">{exam.location}</div>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="w-5 h-5 text-gray-500 mt-0.5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Participation</div>
                <div className="text-sm text-gray-900">
                  {exam.presentStudents}/{exam.totalStudents} étudiants ({attendanceRate}%)
                </div>
              </div>
            </div>
          </div>

          {/* Fraud Incidents */}
          <FraudDetails fraudIncidents={exam.fraudIncidents} />

          {/* Notes */}
          {exam.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex">
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <div className="text-sm font-medium text-blue-800">Notes</div>
                  <div className="text-sm text-blue-700">{exam.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-1.5" />
              Exporter
            </button>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Share2 className="w-4 h-4 mr-1.5" />
              Partager
            </button>
          </div>
        </div>
      )}
    </div>
  );
};