
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockExamStats, mockExams, mockAlerts } from "@/data/mockData";
import { FileCode, Users, Bell, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlertType } from "@/types";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Helper to get color for alert type
const getAlertColor = (type: AlertType) => {
  switch (type) {
    case "face_not_detected":
      return "#ef4444"; // red-500
    case "multiple_faces":
      return "#8b5cf6"; // violet-500
    case "looking_away":
      return "#f59e0b"; // amber-500
    case "missing_commit":
      return "#3b82f6"; // blue-500
    case "suspicious_code":
      return "#ec4899"; // pink-500
    case "tab_switch":
      return "#6b7280"; // gray-500
    default:
      return "#71717a"; // zinc-500
  }
};

// Helper to get human readable alert name
const getAlertName = (type: AlertType) => {
  switch (type) {
    case "face_not_detected":
      return "Visage non détecté";
    case "multiple_faces":
      return "Plusieurs visages";
    case "looking_away":
      return "Regard détourné";
    case "missing_commit":
      return "Commit manquant";
    case "suspicious_code":
      return "Code suspect";
    case "tab_switch":
      return "Changement d'onglet";
    default:
      return type;
  }
};

export const ProfessorDashboard = () => {
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

  // Get upcoming exams
  const upcomingExams = mockExams
    .filter((exam) => new Date(exam.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  // Get recent alerts
  const recentAlerts = [...mockAlerts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Data for charts
  const alertTypeData = mockExamStats.alertsByType.map((alert) => ({
    name: getAlertName(alert.type),
    count: alert.count,
    fill: getAlertColor(alert.type),
  }));

  const pieData = [
    { name: "En cours", value: mockExamStats.inProgress, fill: "#3b82f6" },
    { name: "Terminés", value: mockExamStats.completed, fill: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button asChild>
          <Link to="/professor/monitoring">Surveillance en direct</Link>
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Examens actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileCode className="mr-2 h-4 w-4 text-primary" />
              <div className="text-2xl font-bold">
                {mockExamStats.inProgress}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Étudiants connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <div className="text-2xl font-bold">
                {mockExamStats.inProgress}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertes aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bell className="mr-2 h-4 w-4 text-alert" />
              <div className="text-2xl font-bold">
                {mockAlerts.length}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moy. alertes / étudiant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="mr-2 h-4 w-4 text-warning" />
              <div className="text-2xl font-bold">
                {mockExamStats.averageAlerts}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart of alerts by type */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes par type</CardTitle>
            <CardDescription>
              Distribution des alertes détectées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alertTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart of exam status */}
        <Card>
          <CardHeader>
            <CardTitle>État des examens</CardTitle>
            <CardDescription>
              Répartition des examens en cours et terminés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
          <CardDescription>
            Les dernières alertes détectées pendant les examens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-${alert.type === "face_not_detected" ? "alert" : 
                                          alert.type === "looking_away" ? "warning" : 
                                          "neutral"} text-${alert.type === "face_not_detected" ? "alert" : 
                                                             alert.type === "looking_away" ? "warning" : 
                                                             "neutral"}`}
                    >
                      {getAlertName(alert.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.description}</TableCell>
                  <TableCell>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={alert.resolved ? "outline" : "default"}
                      className={alert.resolved ? "" : "bg-alert animate-pulse-alert"}
                    >
                      {alert.resolved ? "Résolu" : "Actif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/professor/alerts">Voir toutes les alertes</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Upcoming exams */}
      <Card>
        <CardHeader>
          <CardTitle>Prochains examens</CardTitle>
          <CardDescription>
            Vos examens à venir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {exam.type === "mcq" ? "QCM" : 
                       exam.type === "open" ? "Questions ouvertes" : "Programmation"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(exam.startTime)}</TableCell>
                  <TableCell>{exam.duration} min</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Éditer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/professor/exams">Tous les examens</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
