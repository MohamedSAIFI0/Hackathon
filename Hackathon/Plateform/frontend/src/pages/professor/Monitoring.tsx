
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { mockAlerts, mockUsers } from "@/data/mockData";
import { AlertType } from "@/types";
import { 
  AlertTriangle, 
  ArrowRight, 
  Eye, 
  Filter, 
  Search,
  Video,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock student status data (would be real-time data in production)
const studentStatuses = mockUsers
  .filter(user => user.role === "student")
  .map(student => ({
    student,
    status: Math.random() > 0.3 ? "online" : "offline",
    recentAlert: Math.random() > 0.5,
    alertType: ["face_not_detected", "looking_away", "multiple_faces", "tab_switch"][
      Math.floor(Math.random() * 4)
    ] as AlertType,
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
    screenshotUrl: `https://picsum.photos/seed/${student.id}${Math.floor(Math.random() * 100)}/300/200`,
  }));

// Helper to get color for alert type
const getAlertColor = (type: AlertType | string) => {
  switch (type) {
    case "face_not_detected":
      return "alert";
    case "multiple_faces":
      return "professor";
    case "looking_away":
      return "warning";
    case "tab_switch":
      return "neutral";
    case "missing_commit":
      return "student";
    case "suspicious_code":
      return "admin";
    default:
      return "neutral";
  }
};

// Helper to get alert type text
const getAlertTypeText = (type: AlertType | string) => {
  switch (type) {
    case "face_not_detected":
      return "Visage non détecté";
    case "multiple_faces":
      return "Plusieurs visages";
    case "looking_away":
      return "Regard détourné";
    case "tab_switch":
      return "Changement d'onglet";
    case "missing_commit":
      return "Commit manquant";
    case "suspicious_code":
      return "Code suspect";
    default:
      return type;
  }
};

export const Monitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [students, setStudents] = useState(studentStatuses);
  const { toast } = useToast();

  // Filter students based on search and filter
  const filteredStudents = students.filter((student) => {
    // Filter by search term
    const matchesSearch =
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by alert type or status
    let matchesFilter = true;
    if (filter === "online") {
      matchesFilter = student.status === "online";
    } else if (filter === "offline") {
      matchesFilter = student.status === "offline";
    } else if (filter === "alerts") {
      matchesFilter = student.recentAlert;
    } else if (filter) {
      matchesFilter = student.alertType === filter;
    }

    return matchesSearch && matchesFilter;
  });

  // Simulate receiving new alerts in real-time
  useEffect(() => {
    const alertInterval = setInterval(() => {
      // Randomly select a student to generate an alert for
      const randomIndex = Math.floor(Math.random() * students.length);
      const alertTypes: AlertType[] = [
        "face_not_detected",
        "looking_away",
        "multiple_faces",
        "tab_switch",
      ];
      const randomAlertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      
      // Create a copy of students array and update the selected student
      const updatedStudents = [...students];
      updatedStudents[randomIndex] = {
        ...updatedStudents[randomIndex],
        recentAlert: true,
        alertType: randomAlertType,
        lastActivity: new Date().toISOString(),
        // Generate a new random screenshot
        screenshotUrl: `https://picsum.photos/seed/${updatedStudents[randomIndex].student.id}${Math.floor(Math.random() * 1000)}/300/200`,
      };
      
      setStudents(updatedStudents);
      
      // Show a toast notification for the new alert
      toast({
        title: "Nouvelle alerte",
        description: `${getAlertTypeText(randomAlertType)} détecté pour ${updatedStudents[randomIndex].student.name}`,
        variant: "destructive",
      });
    }, 15000); // Generate a new alert every 15 seconds

    return () => clearInterval(alertInterval);
  }, [students, toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Surveillance en direct
        </h1>
        <Button>
          Voir l'historique complet <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un étudiant..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              {filter ? getAlertTypeText(filter) : "Tous les étudiants"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter(null)}>
              Tous les étudiants
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("online")}>
              En ligne
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("offline")}>
              Hors ligne
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("alerts")}>
              Avec alertes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Types d'alertes</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setFilter("face_not_detected")}>
              Visage non détecté
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("looking_away")}>
              Regard détourné
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("multiple_faces")}>
              Plusieurs visages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("tab_switch")}>
              Changement d'onglet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Students grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((studentData) => (
            <Card
              key={studentData.student.id}
              className={
                studentData.recentAlert
                  ? `border-${getAlertColor(studentData.alertType)} bg-${getAlertColor(
                      studentData.alertType
                    )}/5`
                  : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={studentData.student.avatar} />
                      <AvatarFallback>
                        {studentData.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {studentData.student.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {studentData.student.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={studentData.status === "online" ? "default" : "outline"}
                    className={
                      studentData.status === "online" ? "bg-success" : "text-muted-foreground"
                    }
                  >
                    {studentData.status === "online" ? "En ligne" : "Hors ligne"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {/* Webcam screenshot */}
                <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                  {studentData.recentAlert && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                      <Badge
                        className={`bg-${getAlertColor(
                          studentData.alertType
                        )} text-white px-3 py-1.5`}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {getAlertTypeText(studentData.alertType)}
                      </Badge>
                    </div>
                  )}
                  <img
                    src={studentData.screenshotUrl}
                    alt={`Screenshot of ${studentData.student.name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {new Date(studentData.lastActivity).toLocaleTimeString()}
                  </div>
                </div>

                {/* Alert info */}
                {studentData.recentAlert && (
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className={`text-${getAlertColor(studentData.alertType)} font-medium`}>
                        {getAlertTypeText(studentData.alertType)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(studentData.lastActivity).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1 gap-1">
                    <Video className="h-4 w-4" />
                    Stream
                  </Button>
                  <Button className="flex-1 gap-1">
                    <Eye className="h-4 w-4" />
                    Détails
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun résultat</h3>
              <p className="text-muted-foreground">
                Aucun étudiant ne correspond à votre recherche.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Monitoring;
