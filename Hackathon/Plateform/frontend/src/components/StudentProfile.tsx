import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { Calendar, Check, Mail, School, User, X } from "lucide-react";

interface StudentInfo {
  id: string;
  fullName: string;
  studentNumber: string;
  department: string;
  email: string;
  enrollmentDate: string;
  lastExam: string;
  status: "En règle" | "Sous investigation";
  photoUrl: string;
}

export const StudentProfile = () => {
  // Sample student data (in a real app this would come from an API or props)
  const student: StudentInfo = {
    id: "1",
    fullName: "Yassine Amraoui",
    studentNumber: "ETU20220135",
    department: "Informatique et Sciences des Données",
    email: "yassine-amraoui@universite.edu",
    enrollmentDate: "12/09/2022",
    lastExam: "Algorithmes et Structures de Données",
    status: "En règle",
    photoUrl: "https://i.pravatar.cc/300"
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8">Profil de l'étudiant</h1>
      
      <Card className="shadow-lg border-purple-200">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="h-24 w-24 border-2 border-purple-300">
                <img 
                  src={student.photoUrl} 
                  alt={student.fullName}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <CardTitle className="text-2xl mb-1">{student.fullName}</CardTitle>
                <div className="flex items-center">
                  <StatusBadge status={student.status} />
                </div>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <span className="text-sm">Numéro d'étudiant:</span>
              <span className="ml-2 text-foreground font-semibold">{student.studentNumber}</span>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-4" />
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                  <p className="info-label">Nom complet</p>
                </div>
                <p className="info-value">{student.fullName}</p>
              </div>

              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  <School className="h-4 w-4 mr-2 text-purple-500" />
                  <p className="info-label">Département / Filière</p>
                </div>
                <p className="info-value">{student.department}</p>
              </div>

              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 mr-2 text-purple-500" />
                  <p className="info-label">Adresse e-mail</p>
                </div>
                <p className="info-value">{student.email}</p>
              </div>

              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                  <p className="info-label">Date d'inscription</p>
                </div>
                <p className="info-value">{student.enrollmentDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                  <p className="info-label">Dernier examen passé</p>
                </div>
                <p className="info-value">{student.lastExam}</p>
              </div>

              <div className="student-info-item">
                <div className="flex items-center mb-1">
                  {student.status === "En règle" ? (
                    <Check className="h-4 w-4 mr-2 text-status-success" />
                  ) : (
                    <X className="h-4 w-4 mr-2 text-status-danger" />
                  )}
                  <p className="info-label">Statut</p>
                </div>
                <StatusBadge status={student.status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};