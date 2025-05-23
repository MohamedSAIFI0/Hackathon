import { Professor } from '../types';

export const mockProfessorData: Professor = {
  id: '1',
  name: 'Dr. Youssef El Amrani',
  title: 'Professeur associé',
  department: 'Informatique',
  email: 'elamrani@umi.ac.ma',
  phone: '+212 661-123456',
  office: 'Faculté des Sciences, Bureau 203',
  profileImage: 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  biography: 'Dr. Youssef El Amrani est professeur associé au département d’informatique à l’Université Moulay Ismaïl de Meknès. Spécialisé en intelligence artificielle et en science des données, il travaille depuis plus de 12 ans sur des projets de recherche appliqués à la santé, à l’éducation et à l’agriculture intelligente. Passionné par l’enseignement, il encadre de nombreux étudiants de master et de doctorat.',
  education: [
    {
      degree: 'Doctorat',
      institution: 'Université Cadi Ayyad - Marrakech',
      year: '2011',
      field: 'Informatique - Intelligence Artificielle'
    },
    {
      degree: 'Master',
      institution: 'Université Mohammed V - Rabat',
      year: '2007',
      field: 'Informatique et Systèmes Intelligents'
    },
    {
      degree: 'Licence',
      institution: 'Université Ibn Tofail - Kénitra',
      year: '2005',
      field: 'Génie Informatique'
    }
  ],
  expertise: [
    'Intelligence Artificielle',
    'Apprentissage Automatique',
    'Big Data',
    'Vision par Ordinateur',
    'Traitement du Langage Naturel',
    'Internet des Objets',
    'Systèmes Intelligents'
  ],
  courses: [
    {
      id: 'INF401',
      code: 'INF 401',
      name: 'Introduction à l’Intelligence Artificielle',
      schedule: 'Lun/Mer 10:00 - 11:30',
      semester: 'Automne',
      year: '2023',
      description: 'Cours introductif aux concepts fondamentaux de l’intelligence artificielle et ses applications modernes.'
    },
    {
      id: 'INF505',
      code: 'INF 505',
      name: 'Apprentissage Automatique Avancé',
      schedule: 'Mar/Jeu 14:00 - 15:30',
      semester: 'Printemps',
      year: '2024',
      description: 'Exploration approfondie des techniques avancées d’apprentissage machine et leurs cas d’usage réels.'
    },
    {
      id: 'INF701',
      code: 'INF 701',
      name: 'Séminaire de Recherche en IA',
      schedule: 'Ven 13:00 - 16:00',
      semester: 'Automne',
      year: '2023',
      description: 'Séminaire pour doctorants sur les thèmes de recherche actuels en intelligence artificielle.'
    }
  ],
  research: [
    {
      title: 'IA pour la détection précoce des maladies chroniques au Maroc',
      description: 'Développement d’un modèle prédictif basé sur l’apprentissage profond pour les hôpitaux régionaux.'
    },
    {
      title: 'Analyse des sentiments en darija à l’aide du NLP',
      description: 'Création d’un corpus en arabe dialectal marocain et d’un modèle de traitement du langage.'
    },
    {
      title: 'Systèmes intelligents pour l’irrigation automatique',
      description: 'Utilisation de capteurs IoT et de réseaux de neurones pour optimiser l’irrigation dans les régions agricoles.'
    }
  ],
  publications: [
    {
      title: 'Un système intelligent d’aide au diagnostic médical au Maroc',
      authors: ['El Amrani, Y.', 'Bennani, H.', 'Hajji, M.'],
      journal: 'Revue Marocaine d’Informatique Appliquée',
      year: '2022',
      url: 'https://example.com/publication1'
    },
    {
      title: 'Analyse automatique des avis clients en dialecte marocain',
      authors: ['El Amrani, Y.', 'Boukhris, F.'],
      journal: 'Revue Internationale de Traitement Automatique du Langage',
      year: '2021',
      url: 'https://example.com/publication2'
    },
    {
      title: 'Application de l’IA dans l’agriculture intelligente au Maroc',
      authors: ['El Amrani, Y.', 'Lahcen, B.', 'Zahraoui, A.'],
      journal: 'African Journal of AI Research',
      year: '2020',
      url: 'https://example.com/publication3'
    }
  ],
  achievements: [
    {
      title: 'Prix de la recherche appliquée en IA - UMI',
      year: '2022',
      description: 'Décerné pour ses travaux sur l’application de l’IA dans le domaine de la santé publique.'
    },
    {
      title: 'Bourse de recherche du CNRST',
      year: '2020',
      description: 'Financement pour un projet sur les systèmes intelligents en milieu rural.'
    },
    {
      title: 'Prix d’excellence pédagogique',
      year: '2019',
      description: 'Récompensé pour son engagement dans l’enseignement et l’innovation pédagogique.'
    }
  ],
  officeHours: [
    {
      day: 'Lundi',
      startTime: '13:00',
      endTime: '15:00',
      location: 'Faculté des Sciences, Bureau 203'
    },
    {
      day: 'Mercredi',
      startTime: '13:00',
      endTime: '15:00',
      location: 'Faculté des Sciences, Bureau 203'
    },
    {
      day: 'Jeudi',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Virtuel (Zoom)'
    }
  ],
  socialLinks: [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/youssefelamrani'
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/profelamrani'
    },
    {
      platform: 'ResearchGate',
      url: 'https://researchgate.net/profile/Youssef_El_Amrani'
    },
    {
      platform: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=elamraniy'
    }
  ]
};
