/**
 * Format date to locale string
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  /**
   * Format time to locale string
   */
  export const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}h${minutes}`;
  };
  
  /**
   * Calculate time difference in minutes
   */
  export const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes - startTotalMinutes;
  };
  
  /**
   * Format duration in minutes to hours and minutes
   */
  export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    }
    
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };
  
  /**
   * Check if an exam is currently in progress
   */
  export const isExamInProgress = (date: string, startTime: string, endTime: string): boolean => {
    const now = new Date();
    const examDate = new Date(date);
    
    // If not today, it's not in progress
    if (examDate.toDateString() !== now.toDateString()) {
      return false;
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const examStart = new Date(examDate);
    examStart.setHours(startHours, startMinutes, 0);
    
    const examEnd = new Date(examDate);
    examEnd.setHours(endHours, endMinutes, 0);
    
    return now >= examStart && now <= examEnd;
  };