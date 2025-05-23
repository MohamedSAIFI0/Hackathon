
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Menu, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockAlerts } from "@/data/mockData";
import { useState } from "react";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // For demonstration, we'll show mock alerts as notifications
  const notifications = mockAlerts.filter((alert) => !alert.resolved).slice(0, 3);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  const getAlertText = (type: string) => {
    switch (type) {
      case "face_not_detected":
        return "Visage non détecté";
      case "looking_away":
        return "Regard détourné de l'écran";
      case "multiple_faces":
        return "Plusieurs visages détectés";
      case "missing_commit":
        return "Commit manquant";
      case "suspicious_code":
        return "Code suspect détecté";
      case "tab_switch":
        return "Changement d'onglet";
      default:
        return "Alerte système";
    }
  };

  if (!user) return null;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
      {/* Left side - Menu button & page title */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Academy</span>
        </Button>
        <h1 className="ml-2 text-xl font-semibold tracking-tight">
          Academy Guard
        </h1>
      </div>

      {/* Right side - Notifications & User menu */}
      <div className="flex items-center gap-4">
        {/* Notifications dropdown */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-alert"></span>
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-normal">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-medium">Notifications</h2>
                <span className="text-xs text-muted-foreground">
                  {notifications.length} non lu{notifications.length > 1 ? "s" : ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="cursor-pointer py-2 px-4">
                  <div className="flex items-start gap-4">
                    {notification.evidence ? (
                      <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={notification.evidence}
                          alt="Evidence"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-alert/20 flex items-center justify-center flex-shrink-0">
                        <Bell className="h-5 w-5 text-alert" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {getAlertText(notification.type)}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="text-sm text-center w-full font-medium">
                Voir toutes les notifications
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm hidden md:inline-block">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const User = ({ className, ...props }: React.ComponentProps<typeof Settings>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOut = ({ className, ...props }: React.ComponentProps<typeof Settings>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
