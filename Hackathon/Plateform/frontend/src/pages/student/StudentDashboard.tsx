
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockExams, mockStudentExams } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, FileCode, Github } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export const StudentDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Get upcoming exams for the current student
  const studentExams = mockStudentExams.filter((se) => se.studentId === user.id);
  const upcomingExams = studentExams.map((se) => {
    const exam = mockExams.find((e) => e.id === se.examId);
    return { ...se, examDetails: exam };
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate time until exam
  const getTimeUntilExam = (startTime: string) => {
    const now = new Date();
    const examDate = new Date(startTime);
    const diffInMs = examDate.getTime() - now.getTime();
    
    if (diffInMs < 0) return "En cours";
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} jour${diffInDays > 1 ? "s" : ""} ${diffInHours}h`;
    } else {
      return `${diffInHours}h ${Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))}min`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button asChild>
          <Link to="/student/exams">Voir tous les examens</Link>
        </Button>
      </div>

      {/* Welcome message */}
      <Alert variant="default" className="bg-student/10 border-student/20">
        <Calendar className="h-4 w-4 text-student" />
        <AlertTitle>Bienvenue, {user.name} !</AlertTitle>
        <AlertDescription>
          Vous avez {upcomingExams.length} examen{upcomingExams.length > 1 ? "s" : ""} à venir. Consultez votre planning pour vous préparer.
        </AlertDescription>
      </Alert>

      {/* Upcoming exams */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Vos prochains examens</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingExams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{exam.examDetails?.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {exam.examDetails?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {formatDate(exam.examDetails?.startTime || "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {exam.examDetails?.duration} minutes
                    </span>
                  </div>
                  {exam.examDetails?.type === "programming" && (
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="h-4 w-4 text-primary" />
                      <span>Via GitHub</span>
                    </div>
                  )}

                  {/* Time until exam */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Commence dans:</span>
                      <span className="font-medium">{getTimeUntilExam(exam.examDetails?.startTime || "")}</span>
                    </div>
                    <Progress className="h-2" value={80} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant={exam.status === "in_progress" ? "default" : "outline"} 
                  className="w-full"
                >
                  {exam.status === "in_progress" ? "Reprendre" : 
                   exam.status === "not_started" ? "Détails" : "Voir résultats"}
                </Button>
              </CardFooter>
            </Card>
          ))}

          {upcomingExams.length === 0 && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="text-center">Aucun examen à venir</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  Vous n'avez aucun examen programmé pour le moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* GitHub commits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <FileCode className="h-5 w-5" /> Récents travaux pratiques
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Introduction to Programming</CardTitle>
            <CardDescription>Votre dernier commit: il y a 2 heures</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="github-code text-sm">
              <div className="github-code-line github-code-added px-4 py-1">+ def calculate_factorial(n):</div>
              <div className="github-code-line github-code-added px-4 py-1">+     if n == 0 or n == 1:</div>
              <div className="github-code-line github-code-added px-4 py-1">+         return 1</div>
              <div className="github-code-line github-code-added px-4 py-1">+     else:</div>
              <div className="github-code-line github-code-added px-4 py-1">+         return n * calculate_factorial(n-1)</div>
              <div className="github-code-line github-code-removed px-4 py-1">- def calculate_factorial(n):</div>
              <div className="github-code-line github-code-removed px-4 py-1">-     result = 1</div>
              <div className="github-code-line github-code-removed px-4 py-1">-     for i in range(1, n + 1):</div>
              <div className="github-code-line github-code-removed px-4 py-1">-         result *= i</div>
              <div className="github-code-line github-code-removed px-4 py-1">-     return result</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Voir le code complet</Button>
            <Button variant="outline">Historique des commits</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
