
// User roles and authentication
export type UserRole = "student" | "professor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Authentication
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Exams & Assessments
export type ExamType = "mcq" | "open" | "programming";

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: ExamType;
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  courseId: string;
  createdBy: string; // professor id
  githubRepo?: string; // for programming exams
}

export interface StudentExam {
  id: string;
  examId: string;
  studentId: string;
  status: "not_started" | "in_progress" | "submitted" | "graded";
  startedAt?: string;
  submittedAt?: string;
  grade?: number;
  alerts: Alert[];
  commits: GithubCommit[];
}

// Monitoring and alerts
export type AlertType = 
  | "face_not_detected" 
  | "multiple_faces" 
  | "looking_away" 
  | "missing_commit" 
  | "suspicious_code" 
  | "tab_switch";

export interface Alert {
  id: string;
  studentExamId: string;
  type: AlertType;
  timestamp: string;
  description: string;
  evidence?: string; // URL to screenshot or webcam capture
  resolved: boolean;
  resolvedBy?: string; // professor or admin id
  resolvedAt?: string;
}

// GitHub integration
export interface GithubCommit {
  id: string;
  studentExamId: string;
  sha: string;
  message: string;
  timestamp: string;
  additions: number;
  deletions: number;
  url: string;
  suspicious: boolean;
}

// Dashboard and statistics
export interface AlertStats {
  type: AlertType;
  count: number;
}

export interface ExamStats {
  totalStudents: number;
  inProgress: number;
  completed: number;
  averageAlerts: number;
  alertsByType: AlertStats[];
}

// OCR and document verification
export interface Document {
  id: string;
  studentId: string;
  type: "diploma" | "id" | "certificate";
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string; // admin id
  imageUrl: string;
  ocrText?: string;
}
export interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  profileImage: string;
  biography: string;
  education: Education[];
  expertise: string[];
  courses: Course[];
  research: ResearchItem[];
  publications: Publication[];
  achievements: Achievement[];
  officeHours: OfficeHour[];
  socialLinks: SocialLink[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  field: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  schedule: string;
  semester: string;
  year: string;
  description: string;
}

export interface ResearchItem {
  title: string;
  description: string;
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  url?: string;
}

export interface Achievement {
  title: string;
  year: string;
  description: string;
}

export interface OfficeHour {
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}