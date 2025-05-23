
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { 
  Calendar, 
  Home, 
  Settings, 
  User, 
  BookOpen, 
  BookMarked, 
  FileCode, 
  Github, 
  Camera, 
  Bell, 
  ChevronLeft, 
  Shield,
  Users
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const roleColor = {
    student: "bg-student text-white",
    professor: "bg-professor text-white",
    admin: "bg-admin text-white",
  };

  // Navigation items based on user role
  const navItems: NavItem[] = [
    {
      name: "Tableau de bord",
      path: `/${user.role}`,
      icon: <Home className="h-5 w-5" />,
      roles: ["student", "professor", "admin"],
    },
    {
      name: "Examens",
      path: `/${user.role}/exams`,
      icon: <BookOpen className="h-5 w-5" />,
      roles: ["student", "professor"],
    },
    {
      name: "Mon profil",
      path: `/${user.role}/profile`,
      icon: <User className="h-5 w-5" />,
      roles: ["student", "professor", "admin"],
    },
    // Student specific
    {
      name: "Sessions d'examen",
      path: "/student/sessions",
      icon: <BookMarked className="h-5 w-5" />,
      roles: ["student"],
    },
    {
      name: "Commits",
      path: "/student/commits",
      icon: <Github className="h-5 w-5" />,
      roles: ["student"],
    },
    {
      name: "Commits",
      path: "/student/commits",
      icon: <Github className="h-5 w-5" />,
      roles: ["professor"],
    },
    // Professor specific
    {
      name: "Créer un examen",
      path: "/professor/create-exam",
      icon: <FileCode className="h-5 w-5" />,
      roles: ["professor"],
    },
    {
      name: "Surveillance",
      path: "/professor/monitoring",
      icon: <Camera className="h-5 w-5" />,
      roles: ["professor"],
    },
    {
      name: "Alertes",
      path: "/professor/alerts",
      icon: <Bell className="h-5 w-5" />,
      roles: ["professor"],
    },
    // Admin specific
    {
      name: "Gestion des etudiants",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      roles: [],
    },
    {
      name: "Vérification de diplômes",
      path: "/admin/documents",
      icon: <Shield className="h-5 w-5" />,
      roles: [],
    },
    {
      name: "Paramètres du système",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: [],
    },
    {
      name: "Surveillance vidéo",
      path: "/admin/video-monitoring",
      icon: <Camera className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role));
  
  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-sidebar-border",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-20 lg:translate-x-0"
      )}
    >
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center px-2">
          {isOpen ? (
            <div className="text-xl font-bold">Academy Guard</div>
          ) : (
            <div className="text-xl font-bold mx-auto">AG</div>
          )}
        </div>
        <button
          className="p-1 rounded-full hover:bg-sidebar-accent lg:block hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronLeft
            className={cn("h-5 w-5 transition-all", !isOpen && "rotate-180")}
          />
        </button>
      </div>
      
      {/* User info */}
      <div className="flex flex-col items-center py-4 px-2 space-y-2">
        <div className={cn("rounded-full p-1", roleColor[user.role])}>
          <div className="h-16 w-16 rounded-full overflow-hidden">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {isOpen && (
          <div className="text-center">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-sidebar-foreground/70">{user.email}</p>
            <div className="mt-1">
              <span className={cn("px-2 py-1 text-xs rounded-full capitalize", roleColor[user.role])}>
                {user.role === "student" ? "Étudiant" : 
                 user.role === "professor" ? "Professeur" : "Administrateur"}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation links */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md transition-colors",
                  isActive
                    ? `bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-${user.role}`
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                )}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
