import React, { useState, useRef } from "react";
import { QrScanner } from "../components/QrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentResult from "./StudentResult";
import ExamSession from "@/pages/student/ExamSession";
import { toast } from "sonner";

// Types for our student data
interface StudentData {
  id: string;
  name: string;
  photo: string;
  department: string;
  authorized: boolean;
  entryTime?: string;
}

// Mock database of students
const mockStudents: Record<string, StudentData> = {
  "12345": {
    id: "12345",
    name: "Thomas Dubois",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    department: "Informatique",
    authorized: true
  },
  "67890": {
    id: "67890",
    name: "Marie Laurent",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    department: "Sciences Économiques",
    authorized: true
  },
  "24680": {
    id: "24680",
    name: "Lucas Bernard",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
    department: "Mathématiques",
    authorized: false
  }
};

const IdentityVerification: React.FC = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [scanMode, setScanMode] = useState<boolean>(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  const [showExamSession, setShowExamSession] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = (decodedValue: string) => {
    setStudentId(decodedValue);
    verifyStudent(decodedValue);
  };

  const toggleScanMode = () => {
    setScanMode(!scanMode);
    setStudentData(null);
    setVerificationComplete(false);
    setShowExamSession(false);
  };

  const verifyStudent = (id: string) => {
    if (!id.trim()) {
      toast.error("Veuillez saisir ou scanner un matricule étudiant");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const student = mockStudents[id];
      
      if (student) {
        // Add entry time
        const now = new Date();
        const entryTime = now.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
        
        const studentWithTime = {
          ...student,
          entryTime
        };
        
        setStudentData(studentWithTime);
        
        if (student.authorized) {
          toast.success("Identité vérifiée avec succès");
          // Set timeout to show exam session after showing success result
          setTimeout(() => {
            setShowExamSession(true);
          }, 2000);
        } else {
          toast.error("Accès non autorisé");
          // Simulate alert to admin
          console.log("ALERT: Unauthorized access attempt by ID:", id);
        }
      } else {
        toast.error("Étudiant non trouvé");
        setStudentData(null);
      }
      
      setIsLoading(false);
      setVerificationComplete(true);
    }, 1500);
  };

  const handleManualVerify = () => {
    verifyStudent(studentId);
  };

  if (showExamSession && studentData?.authorized) {
    return <ExamSession />;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Vérification d'Identité Étudiante
        </h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700">
              {scanMode ? "Scanner le code étudiant" : "Saisir le matricule étudiant"}
            </h3>
            <Button 
              variant="outline"
              onClick={toggleScanMode}
              disabled={isLoading}
            >
              {scanMode ? "Saisie manuelle" : "Scanner"}
            </Button>
          </div>
          
          {scanMode ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <QrScanner onScan={handleScan} />
              <p className="text-sm text-center p-2 text-gray-500">
                Placez le QR code ou code-barre de la carte étudiante devant la caméra
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Entrez le matricule étudiant"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              <Button 
                onClick={handleManualVerify}
                disabled={isLoading || !studentId.trim()}
                className="w-full"
              >
                {isLoading ? "Vérification..." : "Vérifier l'identité"}
              </Button>
            </div>
          )}
          
          {verificationComplete && studentData && (
            <StudentResult student={studentData} />
          )}
          
          {verificationComplete && !studentData && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Étudiant non trouvé dans la base de données</p>
              <p className="text-sm mt-1">Veuillez vérifier le matricule ou contacter l'administrateur</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;