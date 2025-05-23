import React, { useState, useEffect } from 'react';
import { Exam, ExamFilterOptions } from '../../types/exam';
import { ExamCard } from './ExamCard';
import { ExamStatistics } from './ExamStatistics';
import { ExamFilters } from './ExamFilters';
import { mockExams, currentUser } from '../../utils/mockData';
import { CalendarDays, Bell, Settings, Moon, Sun } from 'lucide-react';

export const ExamHistory: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [filteredExams, setFilteredExams] = useState<Exam[]>(mockExams);
  const [filters, setFilters] = useState<ExamFilterOptions>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Extract unique courses for filter dropdown
  const courses = Array.from(
    new Map(exams.map(exam => [exam.course.id, exam.course])).values()
  );

  // Apply filters to exams
  useEffect(() => {
    let result = [...exams];
    
    // Filter by course
    if (filters.course) {
      result = result.filter(exam => exam.course.id === filters.course);
    }
    
    // Filter by status
    if (filters.status) {
      result = result.filter(exam => exam.status === filters.status);
    }
    
    // Filter by fraud
    if (filters.hasFraud !== undefined) {
      if (filters.hasFraud) {
        result = result.filter(exam => exam.fraudIncidents.length > 0);
      } else {
        result = result.filter(exam => exam.fraudIncidents.length === 0);
      }
    }
    
    // Sort exams by date (most recent first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredExams(result);
  }, [exams, filters]);

  const handleFilterChange = (newFilters: ExamFilterOptions) => {
    setFilters(newFilters);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, you would apply dark mode classes to the root element
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <ExamStatistics exams={exams} />
        
        {/* Filters Section */}
        <ExamFilters 
          onFilterChange={handleFilterChange}
          courses={courses}
        />
        
        {/* Exams List */}
        <div className="space-y-6">
          {filteredExams.length === 0 ? (
            <div className={`p-8 text-center rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className="text-lg font-medium">Aucun examen ne correspond à vos critères de recherche.</p>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            filteredExams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          )}
        </div>
      </main>
      
    
    </div>
  );
};