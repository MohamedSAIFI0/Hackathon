import React, { useState } from 'react';
import { X, Check, AlertTriangle, Eye, Calendar, FileText, Github, Clock, Brain, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface FraudType {
  type: string;
  icon: React.ReactNode;
}

interface ExamEvent {
  timestamp: string;
  description: string;
  type: 'warning' | 'info' | 'error' | 'success';
}

interface Exam {
  id: string;
  name: string;
  date: string;
  fraudDetected: boolean;
  fraudTypes: FraudType[];
  justification: {
    screenshot?: string;
    description: string;
    suspicionScore: number;
    timestamp: string;
  };
  events: ExamEvent[];
  webcamSnapshots?: string[];
  commits?: {
    timestamp: string;
    message: string;
    hash: string;
  }[];
  professorComment?: string;
}

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Exemples de données
  const exams: Exam[] = [
    {
      id: "1",
      name: "Mathématiques – Session Juin 2025",
      date: "2025-06-15",
      fraudDetected: false,
      fraudTypes: [],
      justification: {
        description: "Aucune fraude détectée",
        suspicionScore: 2,
        timestamp: "10:27:15",
      },
      events: [
        { timestamp: "10:15:00", description: "Début de l'examen", type: "info" },
        { timestamp: "10:45:30", description: "Question 1 complétée", type: "success" },
        { timestamp: "11:30:15", description: "Question 2 complétée", type: "success" },
        { timestamp: "12:15:00", description: "Fin de l'examen", type: "info" },
      ],
      commits: [
        { timestamp: "10:20:15", message: "Ajout solution exercice 1", hash: "a1b2c3d" },
        { timestamp: "11:05:22", message: "Correction calcul matrice", hash: "e4f5g6h" },
      ],
      professorComment: "Excellent travail, solutions claires et bien structurées."
    },
    {
      id: "2",
      name: "Programmation Java – Contrôle Final",
      date: "2025-05-20",
      fraudDetected: true,
      fraudTypes: [
        { type: "Regard hors caméra", icon: <Eye className="h-4 w-4" /> },
        { type: "Code généré automatiquement", icon: <Brain className="h-4 w-4" /> },
      ],
      justification: {
        screenshot: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        description: "L'étudiant a détourné son regard de la caméra à plusieurs reprises. Le code soumis présente des similarités avec des solutions générées par IA.",
        suspicionScore: 87,
        timestamp: "14:32:08",
      },
      events: [
        { timestamp: "14:00:00", description: "Début de l'examen", type: "info" },
        { timestamp: "14:32:08", description: "Regard détourné de l'écran pendant 15 secondes", type: "warning" },
        { timestamp: "14:45:20", description: "Soumission de code avec structure similaire à ChatGPT", type: "error" },
        { timestamp: "15:15:00", description: "Fin de l'examen", type: "info" },
      ],
      webcamSnapshots: [
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
      ],
      professorComment: "Le code soumis présente des patterns typiques de génération par IA. Veuillez revoir les règles d'intégrité académique."
    },
    {
      id: "3",
      name: "Bases de Données – Examen Partiel",
      date: "2025-04-10",
      fraudDetected: true,
      fraudTypes: [
        { type: "Tentative de sortie de plateforme", icon: <Monitor className="h-4 w-4" /> },
        { type: "Commit manquant", icon: <Github className="h-4 w-4" /> },
      ],
      justification: {
        screenshot: "https://images.unsplash.com/photo-1573164713712-03790a178651?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
        description: "Plusieurs tentatives de navigation hors de la plateforme d'examen ont été détectées. De plus, un commit crucial est manquant dans l'historique.",
        suspicionScore: 75,
        timestamp: "09:15:32",
      },
      events: [
        { timestamp: "09:00:00", description: "Début de l'examen", type: "info" },
        { timestamp: "09:15:32", description: "Tentative de sortie de la plateforme d'examen", type: "error" },
        { timestamp: "09:35:15", description: "Aucun commit pour la solution de la partie 2", type: "warning" },
        { timestamp: "10:00:00", description: "Fin de l'examen", type: "info" },
      ],
      commits: [
        { timestamp: "09:10:05", message: "Init solution partie 1", hash: "j7k8l9m" },
        { timestamp: "09:45:30", message: "Solution partie 3", hash: "n0p1q2r" },
      ],
      professorComment: "Des tentatives répétées de sortir de la plateforme d'examen ont été enregistrées. L'absence de commit pour la partie 2 est également préoccupante."
    },
    {
      id: "4",
      name: "Réseaux Informatiques – Examen Final",
      date: "2025-03-25",
      fraudDetected: false,
      fraudTypes: [],
      justification: {
        description: "Aucune fraude détectée",
        suspicionScore: 5,
        timestamp: "15:45:00",
      },
      events: [
        { timestamp: "15:00:00", description: "Début de l'examen", type: "info" },
        { timestamp: "15:30:10", description: "Configuration du routeur virtuel complétée", type: "success" },
        { timestamp: "16:15:45", description: "Diagnostic réseau effectué", type: "success" },
        { timestamp: "17:00:00", description: "Fin de l'examen", type: "info" },
      ],
      commits: [
        { timestamp: "15:20:33", message: "Configuration initiale", hash: "s3t4u5v" },
        { timestamp: "16:05:12", message: "Résolution problème DHCP", hash: "w6x7y8z" },
        { timestamp: "16:40:25", message: "Documentation finale", hash: "a9b8c7d" },
      ],
      professorComment: "Très bonne compréhension des concepts de réseau. Documentation claire et précise."
    }
  ];

  const handleOpenModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Historique des examens</h1>
      <p className="text-muted-foreground mb-8">Consultez les détails de vos examens passés et leur statut</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div 
            key={exam.id} 
            className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
              exam.fraudDetected ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold line-clamp-2">{exam.name}</h2>
                {exam.fraudDetected ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <X className="h-3 w-3" /> Fraude détectée
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Aucune fraude
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(exam.date)}</span>
              </div>
              
              {exam.fraudDetected && (
                <>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                      Type(s) de fraude détecté(s):
                    </div>
                    <div className="flex flex-wrap gap-2 my-2">
                      {exam.fraudTypes.map((fraud, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                          {fraud.icon}
                          <span>{fraud.type}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Suspicion de fraude:</div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            exam.justification.suspicionScore > 75 ? 'bg-red-500' :
                            exam.justification.suspicionScore > 30 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${exam.justification.suspicionScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{exam.justification.suspicionScore}%</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {exam.justification.description}
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{exam.justification.timestamp}</span>
                </div>
                <Button variant="outline" onClick={() => handleOpenModal(exam)}>
                  <Eye className="h-4 w-4 mr-1" /> Voir détails
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedExam && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedExam.name}
                {selectedExam.fraudDetected ? (
                  <Badge variant="destructive" className="ml-2 inline-flex items-center">
                    <X className="h-3 w-3 mr-1" /> Fraude détectée
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 inline-flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Aucune fraude
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {formatDate(selectedExam.date)}
                </div>
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="chronology">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chronology">Chronologie</TabsTrigger>
                <TabsTrigger value="evidence">Preuves</TabsTrigger>
                <TabsTrigger value="comments">Commentaires</TabsTrigger>
              </TabsList>

              <TabsContent value="chronology" className="space-y-4">
                <h3 className="text-lg font-medium mt-4">Chronologie des événements</h3>
                <div className="space-y-3">
                  {selectedExam.events.map((event, idx) => (
                    <div key={idx} className={`p-3 rounded-md border flex items-start gap-3 ${
                      event.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                      event.type === 'error' ? 'bg-red-50 border-red-200' : 
                      event.type === 'success' ? 'bg-green-50 border-green-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className={`p-1.5 rounded-full ${
                        event.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                        event.type === 'error' ? 'bg-red-100 text-red-600' : 
                        event.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {event.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        {event.type === 'error' && <X className="h-4 w-4" />}
                        {event.type === 'success' && <Check className="h-4 w-4" />}
                        {event.type === 'info' && <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedExam.commits && selectedExam.commits.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mt-6">Logs de commit</h3>
                    <div className="space-y-2">
                      {selectedExam.commits.map((commit, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-start">
                          <div className="p-1.5 mr-3 rounded-full bg-slate-200">
                            <Github className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-mono text-sm">{commit.hash}</div>
                            <div className="font-medium">{commit.message}</div>
                            <div className="text-sm text-muted-foreground">{commit.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="evidence">
                {selectedExam.fraudDetected && (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <h3 className="text-lg font-medium text-red-700 mb-2">Justification de détection de fraude</h3>
                      <p className="text-red-600 mb-4">{selectedExam.justification.description}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Score de suspicion</p>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 rounded-full ${
                                  selectedExam.justification.suspicionScore > 75 ? 'bg-red-500' :
                                  selectedExam.justification.suspicionScore > 30 ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${selectedExam.justification.suspicionScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold">{selectedExam.justification.suspicionScore}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Timestamp</p>
                          <p className="font-mono">{selectedExam.justification.timestamp}</p>
                        </div>
                      </div>
                    </div>

                    {selectedExam.webcamSnapshots && selectedExam.webcamSnapshots.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Captures webcam</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedExam.webcamSnapshots.map((snapshot, idx) => (
                            <div key={idx} className="border rounded-md overflow-hidden">
                              <img 
                                src={snapshot} 
                                alt={`Snapshot ${idx + 1}`} 
                                className="w-full h-48 object-cover"
                              />
                              <div className="p-2 bg-gray-50">
                                <p className="text-sm text-center text-muted-foreground">
                                  Capture #{idx + 1} - {selectedExam.justification.timestamp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedExam.justification.screenshot && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Capture d'écran</h3>
                        <div className="border rounded-md overflow-hidden">
                          <img 
                            src={selectedExam.justification.screenshot} 
                            alt="Evidence screenshot" 
                            className="w-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!selectedExam.fraudDetected && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-green-700">Aucune fraude détectée</h3>
                    <p className="text-muted-foreground mt-2">
                      L'examen s'est déroulé sans incident et aucune activité suspecte n'a été détectée.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Commentaire du professeur</h3>
                  <p>{selectedExam.professorComment || "Aucun commentaire disponible."}</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Index;
