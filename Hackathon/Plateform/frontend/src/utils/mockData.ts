import { Exam, User } from '../types/exam';

export const currentUser: User = {
  id: 'prof-123',
  name: 'Dr. Sophie Martin',
  email: 'sophie.martin@university.edu',
  role: 'professor',
  avatarUrl: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=150'
};

export const mockExams: Exam[] = [
  {
    id: 'exam-001',
    title: 'Examen Final - Algorithmique Avancée',
    course: {
      id: 'course-001',
      code: 'INFO4201',
      name: 'Algorithmique Avancée'
    },
    date: '2024-06-15',
    startTime: '09:00',
    endTime: '12:00',
    duration: 180,
    location: 'Amphithéâtre A1',
    status: 'completed',
    totalStudents: 120,
    presentStudents: 118,
    absentStudents: 2,
    fraudIncidents: [
      {
        id: 'fraud-001',
        studentId: 'student-056',
        studentName: 'Thomas Dupont',
        description: 'Utilisation d\'un téléphone portable pendant l\'examen',
        timestamp: '2024-06-15T10:23:00',
        severity: 'high',
        resolved: true,
        evidence: 'Photo prise par le surveillant',
        notes: 'L\'étudiant a été exclu de l\'examen'
      },
      {
        id: 'fraud-002',
        studentId: 'student-089',
        studentName: 'Marie Leroy',
        description: 'Notes manuscrites non autorisées',
        timestamp: '2024-06-15T11:05:00',
        severity: 'medium',
        resolved: true,
        notes: 'Avertissement donné'
      }
    ],
    proctors: [
      {
        id: 'prof-123',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@university.edu',
        role: 'professor'
      },
      {
        id: 'assist-045',
        name: 'Jean Dubois',
        email: 'jean.dubois@university.edu',
        role: 'assistant'
      }
    ],
    notes: 'Examen s\'est déroulé dans de bonnes conditions malgré deux cas de fraude',
    createdBy: 'prof-123',
    createdAt: '2024-05-20T14:30:00',
    updatedAt: '2024-06-15T13:15:00'
  },
  {
    id: 'exam-002',
    title: 'Examen Intermédiaire - Structures de Données',
    course: {
      id: 'course-002',
      code: 'INFO3102',
      name: 'Structures de Données'
    },
    date: '2024-05-10',
    startTime: '14:00',
    endTime: '16:00',
    duration: 120,
    location: 'Salle B204',
    status: 'completed',
    totalStudents: 85,
    presentStudents: 82,
    absentStudents: 3,
    fraudIncidents: [],
    proctors: [
      {
        id: 'prof-123',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@university.edu',
        role: 'professor'
      }
    ],
    notes: 'Examen sans incident',
    createdBy: 'prof-123',
    createdAt: '2024-04-15T10:20:00',
    updatedAt: '2024-05-10T16:30:00'
  },
  {
    id: 'exam-003',
    title: 'Examen Final - Programmation Orientée Objet',
    course: {
      id: 'course-003',
      code: 'INFO2103',
      name: 'Programmation Orientée Objet'
    },
    date: '2024-06-20',
    startTime: '10:00',
    endTime: '13:00',
    duration: 180,
    location: 'Amphithéâtre B2',
    status: 'scheduled',
    totalStudents: 95,
    presentStudents: 0,
    absentStudents: 0,
    fraudIncidents: [],
    proctors: [
      {
        id: 'prof-123',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@university.edu',
        role: 'professor'
      },
      {
        id: 'assist-046',
        name: 'Clara Petit',
        email: 'clara.petit@university.edu',
        role: 'assistant'
      }
    ],
    notes: 'Prévoir suffisamment de copies supplémentaires',
    createdBy: 'prof-123',
    createdAt: '2024-05-25T09:15:00',
    updatedAt: '2024-05-25T09:15:00'
  },
  {
    id: 'exam-004',
    title: 'Examen Final - Sécurité Informatique',
    course: {
      id: 'course-004',
      code: 'INFO4205',
      name: 'Sécurité Informatique'
    },
    date: '2024-06-18',
    startTime: '13:30',
    endTime: '16:30',
    duration: 180,
    location: 'Salle C105',
    status: 'completed',
    totalStudents: 65,
    presentStudents: 62,
    absentStudents: 3,
    fraudIncidents: [
      {
        id: 'fraud-003',
        studentId: 'student-112',
        studentName: 'Lucas Bernard',
        description: 'Communication entre étudiants',
        timestamp: '2024-06-18T14:45:00',
        severity: 'low',
        resolved: true,
        notes: 'Avertissement donné, pas de récidive'
      },
      {
        id: 'fraud-004',
        studentId: 'student-118',
        studentName: 'Emma Girard',
        description: 'Utilisation d\'un appareil électronique non autorisé',
        timestamp: '2024-06-18T15:20:00',
        severity: 'high',
        resolved: true,
        evidence: 'Appareil confisqué',
        notes: 'L\'étudiante a été exclue de l\'examen'
      },
      {
        id: 'fraud-005',
        studentId: 'student-124',
        studentName: 'Hugo Moreau',
        description: 'Documents non autorisés',
        timestamp: '2024-06-18T15:55:00',
        severity: 'medium',
        resolved: true,
        notes: 'Documents confisqués'
      }
    ],
    proctors: [
      {
        id: 'prof-123',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@university.edu',
        role: 'professor'
      },
      {
        id: 'assist-047',
        name: 'Pierre Lambert',
        email: 'pierre.lambert@university.edu',
        role: 'assistant'
      }
    ],
    notes: 'Plusieurs cas de fraude détectés. Revoir les conditions de surveillance pour les prochains examens.',
    createdBy: 'prof-123',
    createdAt: '2024-05-20T11:45:00',
    updatedAt: '2024-06-18T17:00:00'
  },
  {
    id: 'exam-005',
    title: 'Examen Intermédiaire - Bases de Données Avancées',
    course: {
      id: 'course-005',
      code: 'INFO3205',
      name: 'Bases de Données Avancées'
    },
    date: '2025-04-25',
    startTime: '09:30',
    endTime: '11:30',
    duration: 120,
    location: 'Salle D301',
    status: 'scheduled',
    totalStudents: 75,
    presentStudents: 0,
    absentStudents: 0,
    fraudIncidents: [],
    proctors: [
      {
        id: 'prof-123',
        name: 'Dr. Sophie Martin',
        email: 'sophie.martin@university.edu',
        role: 'professor'
      }
    ],
    createdBy: 'prof-123',
    createdAt: '2025-03-15T16:00:00',
    updatedAt: '2025-03-15T16:00:00'
  }
];