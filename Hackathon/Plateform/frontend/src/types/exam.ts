export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'professor' | 'assistant';
    avatarUrl?: string;
  }
  
  export interface FraudIncident {
    id: string;
    studentId: string;
    studentName: string;
    description: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
    resolved: boolean;
    evidence?: string;
    notes?: string;
  }
  
  export interface Exam {
    id: string;
    title: string;
    course: {
      id: string;
      code: string;
      name: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    location: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    totalStudents: number;
    presentStudents: number;
    absentStudents: number;
    fraudIncidents: FraudIncident[];
    proctors: User[];
    notes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type ExamFilterOptions = {
    course?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    status?: Exam['status'];
    hasFraud?: boolean;
  };