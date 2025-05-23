import React, { useState } from 'react';
import { ExamFilterOptions } from '../../types/exam';
import { 
  Search, 
  Filter, 
  Calendar,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

interface ExamFiltersProps {
  onFilterChange: (filters: ExamFilterOptions) => void;
  courses: { id: string; code: string; name: string }[];
}

export const ExamFilters: React.FC<ExamFiltersProps> = ({ 
  onFilterChange,
  courses
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ExamFilterOptions>({});

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterKey: keyof ExamFilterOptions, value: any) => {
    const newFilters = { 
      ...filters, 
      [filterKey]: value 
    };
    
    // If value is empty, remove the filter
    if (!value) {
      delete newFilters[filterKey];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onFilterChange({});
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher un examen..."
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          type="button"
          onClick={toggleFilters}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {Object.keys(filters).length > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.keys(filters).length}
            </span>
          )}
        </button>

        {/* Clear Filters Button (only visible when filters are applied) */}
        {Object.keys(filters).length > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div>
              <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Cours
              </label>
              <select
                id="course-filter"
                value={filters.course || ''}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les cours</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                <CheckSquare className="w-4 h-4 inline mr-1" />
                Statut
              </label>
              <select
                id="status-filter"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les statuts</option>
                <option value="scheduled">Planifié</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Fraud Filter */}
            <div>
              <label htmlFor="fraud-filter" className="block text-sm font-medium text-gray-700 mb-1">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Fraudes
              </label>
              <select
                id="fraud-filter"
                value={filters.hasFraud === undefined ? '' : filters.hasFraud.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleFilterChange('hasFraud', undefined);
                  } else {
                    handleFilterChange('hasFraud', value === 'true');
                  }
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les examens</option>
                <option value="true">Avec fraudes</option>
                <option value="false">Sans fraude</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};