import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebcamMonitoring } from "@/components/webcam/WebcamMonitoring";
import { CommitHistory } from "@/components/github/CommitHistory";
import { mockExams, mockStudentExams } from "@/data/mockData";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle, Clock, Github, Save } from "lucide-react";

export const ExamSession = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(120);
  const [progress, setProgress] = useState<number>(0);
  const [webcamAlerts, setWebcamAlerts] = useState<number>(0);
  const [commitStatus, setCommitStatus] = useState<"ok" | "missing" | "pending">("ok");
  const { toast } = useToast();

  const studentExam = mockStudentExams[0];
  const exam = mockExams.find((e) => e.id === studentExam.examId);

  const formatTimeRemaining = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Handle face detection from webcam
  const handleFaceDetection = (detected: boolean) => {
    if (!detected) {
      setWebcamAlerts((prev) => prev + 1);
      toast({
        title: "Alerte!",
        description: "Votre visage n'est pas détecté. Veuillez vous repositionner.",
        variant: "destructive",
      });
    }
  };

  // Handle looking away detection
  const handleLookingAway = (lookingAway: boolean) => {
    if (lookingAway) {
      toast({
        title: "Attention!",
        description: "Vous semblez regarder ailleurs. Concentrez-vous sur l'examen.",
        variant: "destructive",
      });
    }
  };

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Detect PrintScreen key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'PrintScreen') {
        alert("Prendre des captures d'écran est interdit.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Detect when the user tries to leave the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = "Vous n'avez pas le droit de repasser l'examen.";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Sample code editor content
  const sampleCode = `def is_prime(n):
    """Checks if a number is prime."""
    if n <= 1:
        return False
    
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    
    return True

def find_primes(limit):
    """Find all prime numbers up to limit."""
    primes = []
    for num in range(2, limit + 1):
        if is_prime(num):
            primes.append(num)
    return primes

# Test the function
prime_list = find_primes(100)
print(prime_list)
`;

  return (
    <div className="relative space-y-6">
      {/* Superposition pour décourager les captures d'écran */}
      <div className="screenshot-overlay absolute top-0 left-0 w-full h-full bg-white opacity-0 pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exam?.title}</h1>
          <p className="text-muted-foreground">{exam?.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="bg-primary/10 text-primary font-bold rounded-md px-3 py-1 text-2xl">
            {formatTimeRemaining(timeRemaining)}
          </div>
          <span className="text-xs text-muted-foreground">Temps restant</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Main exam content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Consignes</CardTitle>
              <CardDescription>
                Lisez attentivement les instructions avant de commencer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Vous êtes invité à créer un programme qui génère et vérifie des nombres premiers.
                Complétez les fonctions suivantes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded-sm">is_prime(n)</code>: Vérifie si un nombre est premier
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded-sm">find_primes(limit)</code>: Trouve tous les nombres premiers jusqu'à une limite
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded-sm">largest_prime_factor(n)</code>: Trouve le plus grand facteur premier d'un nombre
                </li>
              </ul>

              <div className="bg-muted p-3 rounded-md">
                <strong>Attention:</strong> Votre travail doit être sauvegardé via GitHub toutes les 10 minutes au minimum.
                Les commits manquants peuvent entraîner des pénalités.
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="editor">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="editor">Éditeur de code</TabsTrigger>
              <TabsTrigger value="output">Résultat</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <Card>
                <CardContent className="p-0 min-h-[400px]">
                  <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-md font-mono text-sm overflow-x-auto min-h-[400px]">
                    <pre className="whitespace-pre-wrap">{sampleCode}</pre>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Autosave: ON
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">Exécuter</Button>
                    <Button className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="output">
              <Card>
                <CardContent className="p-0 min-h-[400px]">
                  <div className="bg-black text-white p-4 rounded-md font-mono text-sm min-h-[400px] overflow-y-auto">
                    <div className="text-green-400">$ python main.py</div>
                    <div className="my-2">
                      [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
                    </div>
                    <div className="text-green-400">$ _</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Effacer la sortie
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" /> Statut des commits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={commitStatus === "ok" ? "default" : "outline"}
                    className={
                      commitStatus === "missing"
                        ? "bg-alert text-white"
                        : commitStatus === "pending"
                        ? "bg-warning text-white"
                        : ""
                    }
                  >
                    {commitStatus === "ok"
                      ? "Commits à jour"
                      : commitStatus === "missing"
                      ? "Commit manquant"
                      : "En attente"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Dernier commit: il y a 5 minutes
                  </span>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Github className="h-4 w-4" /> Commit maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Webcam monitoring and commit history */}
        <div className="space-y-6">
          {/* Webcam monitoring */}
          <div>
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-1">
              <span>Surveillance vidéo</span>
              {webcamAlerts > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {webcamAlerts} alerte{webcamAlerts > 1 ? "s" : ""}
                </Badge>
              )}
            </h2>
            <WebcamMonitoring
              autoDetect={true}
              screenshotInterval={10}
              onFaceDetection={handleFaceDetection}
              onLookingAway={handleLookingAway}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              La caméra doit rester active pendant toute la durée de l'examen
            </div>
          </div>

          {/* Warning alerts */}
          {webcamAlerts > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Attention!</AlertTitle>
              <AlertDescription>
                {webcamAlerts} comportement{webcamAlerts > 1 ? "s" : ""} suspect
                {webcamAlerts > 1 ? "s" : ""} détecté
                {webcamAlerts > 1 ? "s" : ""}. Ces incidents sont enregistrés
                et peuvent affecter votre évaluation.
              </AlertDescription>
            </Alert>
          )}

          {/* Commit history */}
          <CommitHistory studentExamId="se1" maxCommits={3} showSuspicious={false} />

          <Button variant="outline" className="w-full" asChild>
            <a href={exam?.githubRepo} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Ouvrir sur GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamSession;