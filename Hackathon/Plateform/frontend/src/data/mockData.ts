
import { User, Exam, StudentExam, Alert, GithubCommit, Document, AlertStats, ExamStats } from "../types";

// Users
export const mockUsers: User[] = [
  {
    id: "s1",
    name: "Hamza Faqir",
    email: "hamza-faqir@student.edu",
    role: "student",
    avatar: "",
  },
  {
    id: "s2",
    name: "Ilyas Arfaoui",
    email: "Ilyas-arfaoui@student.edu",
    role: "student",
    avatar: "",
  },
  {
    id: "p1",
    name: "Mohamed SAIFI",
    email: "mohamed-saifi@professor.edu",
    role: "professor",
    avatar: "",
  },
  {
    id: "p2",
    name: "Nohaila Karim",
    email: "nohaila-karim@professor.edu",
    role: "professor",
    avatar: "",
  },
  {
    id: "a1",
    name: "Yassir Amraoui",
    email: "yassir-amraoui@examguard.edu",
    role: "admin",
    avatar: "",
  },
];

// Exams
export const mockExams: Exam[] = [
  {
    id: "e1",
    title: "Introduction à la programmation",
    description: "Concepts fondamentaux de la programmation avec Python",
    type: "programming",
    duration: 120,
    startTime: "2025-05-25T09:00:00",
    endTime: "2025-05-25T11:00:00",
    courseId: "c1",
    createdBy: "p1",
    githubRepo: "github.com/examguard/intro-programming-exam",
  },
  {
    id: "e2",
    title: "Structures de données",
    description: "Implémentation et analyse des structures de données de base",
    type: "programming",
    duration: 180,
    startTime: "2025-05-27T14:00:00",
    endTime: "2025-05-27T17:00:00",
    courseId: "c2",
    createdBy: "p1",
    githubRepo: "github.com/examguard/data-structures-exam",
  },
  {
    id: "e3",
    title: "Développement Web",
    description: "Notions fondamentales de HTML, CSS et JavaScript",
    type: "mcq",
    duration: 60,
    startTime: "2025-05-29T10:00:00",
    endTime: "2025-05-29T11:00:00",
    courseId: "c3",
    createdBy: "p2",
  },
];

// Examens étudiants
export const mockStudentExams: StudentExam[] = [
  {
    id: "se1",
    examId: "e1",
    studentId: "s1",
    status: "in_progress",
    startedAt: "2025-05-25T09:05:00",
    alerts: [],
    commits: [],
  },
  {
    id: "se2",
    examId: "e2",
    studentId: "s1",
    status: "not_started",
    alerts: [],
    commits: [],
  },
  {
    id: "se3",
    examId: "e1",
    studentId: "s2",
    status: "in_progress",
    startedAt: "2025-05-25T09:02:00",
    alerts: [],
    commits: [],
  },
];

// Alertes
export const mockAlerts: Alert[] = [
  {
    id: "a1",
    studentExamId: "se1",
    type: "face_not_detected",
    timestamp: "2025-05-25T09:15:00",
    description: "Visage non détecté pendant plus de 10 secondes",
    evidence: "https://picsum.photos/seed/face1/300/200",
    resolved: false,
  },
  {
    id: "a2",
    studentExamId: "se1",
    type: "looking_away",
    timestamp: "2025-05-25T09:25:00",
    description: "Étudiant détournant le regard de l’écran",
    evidence: "https://picsum.photos/seed/away1/300/200",
    resolved: false,
  },
  {
    id: "a3",
    studentExamId: "se3",
    type: "missing_commit",
    timestamp: "2025-05-25T09:30:00",
    description: "Aucun commit détecté au cours des 10 dernières minutes",
    resolved: false,
  },
  {
    id: "a4",
    studentExamId: "se3",
    type: "tab_switch",
    timestamp: "2025-05-25T09:40:00",
    description: "Commutation entre plusieurs onglets détectée",
    evidence: "https://picsum.photos/seed/tab1/300/200",
    resolved: true,
    resolvedBy: "p1",
    resolvedAt: "2025-05-25T09:45:00",
  },
];

// Commits GitHub
export const mockCommits: GithubCommit[] = [
  {
    id: "c1",
    studentExamId: "se1",
    sha: "8f7d1a6323abcdef",
    message: "Mise en place de la solution initiale",
    timestamp: "2025-05-25T09:10:00",
    additions: 25,
    deletions: 0,
    url: "https://github.com/examguard/intro-programming-exam/commit/8f7d1a6323abcdef",
    suspicious: false,
  },
  {
    id: "c2",
    studentExamId: "se1",
    sha: "2b3c4d5e6f7g8h9i",
    message: "Implémentation de la fonction principale",
    timestamp: "2025-05-25T09:20:00",
    additions: 15,
    deletions: 2,
    url: "https://github.com/examguard/intro-programming-exam/commit/2b3c4d5e6f7g8h9i",
    suspicious: false,
  },
  {
    id: "c3",
    studentExamId: "se3",
    sha: "a1b2c3d4e5f6g7h8",
    message: "Tâches 1 et 2 complétées",
    timestamp: "2025-05-25T09:15:00",
    additions: 42,
    deletions: 5,
    url: "https://github.com/examguard/intro-programming-exam/commit/a1b2c3d4e5f6g7h8",
    suspicious: true,
  },
];

// Documents
export const mockDocuments: Document[] = [
  {
    id: "d1",
    studentId: "s1",
    type: "diploma",
    status: "verified",
    uploadedAt: "2025-05-10T10:00:00",
    verifiedAt: "2025-05-11T14:30:00",
    verifiedBy: "a1",
    imageUrl: "https://picsum.photos/seed/diploma1/400/300",
    ocrText: "UNIVERSITÉ DE Mohammedia\nDIPLÔME\nMoha SAIFI\nLicence en Informatique\nMention Bien",
  },
  {
    id: "d2",
    studentId: "s2",
    type: "diploma",
    status: "pending",
    uploadedAt: "2025-05-20T16:45:00",
    imageUrl: "https://picsum.photos/seed/diploma2/400/300",
  },
];

// Statistiques
export const mockAlertStats: AlertStats[] = [
  { type: "face_not_detected", count: 12 },
  { type: "looking_away", count: 8 },
  { type: "multiple_faces", count: 3 },
  { type: "missing_commit", count: 7 },
  { type: "suspicious_code", count: 2 },
  { type: "tab_switch", count: 15 },
];

export const mockExamStats: ExamStats = {
  totalStudents: 25,
  inProgress: 18,
  completed: 7,
  averageAlerts: 1.8,
  alertsByType: mockAlertStats,
};

// Utilisateur actuel fictif
export const currentUser = mockUsers.find(user => user.id === "s1");
