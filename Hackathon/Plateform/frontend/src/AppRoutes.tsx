import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import { useEffect } from "react";

// Student Routes
import StudentDashboard from "@/pages/student/StudentDashboard";
import Exams from "@/pages/student/Exams";
import Commits from "@/pages/student/Commits";

// Professor Routes
import ProfessorDashboard from "@/pages/professor/ProfessorDashboard";
import Monitoring from "@/pages/professor/Monitoring";

// Admin Routes
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DocumentVerification from "@/pages/admin/DocumentVerification";

// Common Routes
import NotFound from "@/pages/NotFound";
import { Navigate } from "react-router-dom";
import ExamCreation from "./pages/professor/ExamCreation";
import ProfessorProfile from "./pages/professor/ProfessorProfile";
import { ExamHistory } from "./components/exams/ExamHistory";
import { mockProfessorData } from "./data/mockProfessorData";
import AlertDashboard from "./pages/professor/AlertDashboard";
import { StudentProfile } from "./components/StudentProfile";
import IdentityVerification from "./components/IdentityVerification";
import CommitHistory from "./components/github/CommitHistory";

// Composant de redirection pour les étudiants
const StudentRedirectToCommits = () => {
  useEffect(() => {
    console.log("STUDENT: Redirection vers commits");
    const redirectUrl = "http://localhost:3001/";
    
    const timer = setTimeout(() => {
      const newWindow = window.open(redirectUrl, "_blank", "noopener,noreferrer");
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        console.log("STUDENT: Popup bloquée");
        setTimeout(() => {
          if (window.confirm("Voulez-vous être redirigé vers l'application Commits ?")) {
            window.location.href = redirectUrl;
          }
        }, 500);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Redirection Étudiant vers Commits
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

// Composant de redirection pour les professeurs
const ProfessorRedirectToCommits = () => {
  useEffect(() => {
    console.log("PROFESSOR: Composant monté, tentative de redirection");
    const redirectUrl = "http://localhost:3001/";
    
    // Redirection immédiate sans délai
    console.log("PROFESSOR: Tentative d'ouverture de:", redirectUrl);
    
    try {
      const newWindow = window.open(redirectUrl, "_blank", "noopener,noreferrer");
      console.log("PROFESSOR: Résultat window.open:", newWindow);
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        console.log("PROFESSOR: Popup bloquée, tentative alternative");
        // Redirection directe sans confirmation
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("PROFESSOR: Erreur lors de la redirection:", error);
      window.location.href = redirectUrl;
    }
  }, []);

  const handleForceRedirect = () => {
    console.log("PROFESSOR: Redirection forcée");
    window.location.href = "http://localhost:3001/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Redirection Professeur vers Commits
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        
        <button
          onClick={handleForceRedirect}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
        >
          Forcer la redirection
        </button>
        
        <div className="mt-4 text-sm">
          <a 
            href="http://localhost:3001/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Lien direct vers Commits
          </a>
        </div>
      </div>
    </div>
  );
};

// Composant de test pour vérifier si le composant est rendu
const TestProfessorComponent = () => {
  useEffect(() => {
    console.log("TEST: Composant de test professeur rendu");
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Test Professeur</h1>
      <p>Si vous voyez ce message, le routing professeur fonctionne.</p>
      <button 
        onClick={() => window.open("http://localhost:3001/", "_blank")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test redirection manuelle
      </button>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Professor Routes */}
      <Route path="/professor" element={<MainLayout allowedRoles={["professor"]} />}>
        <Route index element={<ProfessorDashboard />} />
        <Route path="exams" element={<ExamHistory />} />
        <Route path="profile" element={<ProfessorProfile professor={mockProfessorData} />} />
        <Route path="create-exam" element={<ExamCreation/>} />
        <Route path="commits" element={ <CommitHistory/> } />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="alerts" element={<AlertDashboard/>} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<MainLayout allowedRoles={["student"]} />}>
        <Route index element={<StudentDashboard />} />
        <Route path="exams" element={<Exams/>} />
        <Route path="profile" element={<StudentProfile/>} />
        <Route path="sessions" element={<IdentityVerification />} />
        <Route path="commits" element={<StudentRedirectToCommits />} /> 
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<MainLayout allowedRoles={["admin"]} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<div>Admin Profile</div>} />
        <Route path="documents" element={<DocumentVerification />} />
        <Route path="settings" element={<div>System Settings</div>} />
        <Route path="video-monitoring" element={<div>Video Monitoring</div>} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;