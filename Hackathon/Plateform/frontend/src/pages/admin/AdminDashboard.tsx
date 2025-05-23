
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
import { Progress } from "@/components/ui/progress";
import { mockDocuments } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Shield, 
  Camera, 
  FileCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Mock data for system metrics
const systemMetrics = [
  { time: "00:00", users: 5, cameras: 3, alerts: 1 },
  { time: "04:00", users: 3, cameras: 2, alerts: 0 },
  { time: "08:00", users: 15, cameras: 10, alerts: 2 },
  { time: "12:00", users: 45, cameras: 30, alerts: 8 },
  { time: "16:00", users: 50, cameras: 35, alerts: 12 },
  { time: "20:00", users: 25, cameras: 18, alerts: 5 },
  { time: "23:59", users: 10, cameras: 7, alerts: 2 },
];

export const AdminDashboard = () => {
  // Get pending documents
  const pendingDocuments = mockDocuments.filter(doc => doc.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <Button asChild>
          <Link to="/admin/settings">Paramètres du système</Link>
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-admin/10 border-admin/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-admin" />
              <div className="text-2xl font-bold">
                120
              </div>
              <Badge variant="outline" className="ml-2 text-xs">+12%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-student/10 border-student/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Examens aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-student" />
              <div className="text-2xl font-bold">
                8
              </div>
              <Badge variant="outline" className="ml-2 text-xs">2 en cours</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-professor/10 border-professor/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Caméras actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-professor" />
              <div className="text-2xl font-bold">
                35
              </div>
              <Badge variant="outline" className="ml-2 text-xs">100% opérationnel</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-alert/10 border-alert/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertes systèmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-alert" />
              <div className="text-2xl font-bold">
                3
              </div>
              <Badge variant="outline" className="ml-2 text-xs text-alert">À résoudre</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System metrics chart */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques du système</CardTitle>
          <CardDescription>
            Activité sur les dernières 24 heures
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={systemMetrics}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                  name="Utilisateurs"
                />
                <Area 
                  type="monotone" 
                  dataKey="cameras" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                  name="Caméras"
                />
                <Area 
                  type="monotone" 
                  dataKey="alerts" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Alertes"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileCheck className="h-4 w-4" /> Documents en attente
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1">
            <Shield className="h-4 w-4" /> Alertes système
          </TabsTrigger>
          <TabsTrigger value="cameras" className="flex items-center gap-1">
            <Camera className="h-4 w-4" /> Surveillance vidéo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Vérification de documents</CardTitle>
              <CardDescription>
                Documents en attente de vérification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Téléchargé le</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="capitalize">{doc.type}</TableCell>
                      <TableCell>Étudiant #{doc.studentId}</TableCell>
                      <TableCell>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "pending" ? "outline" : "default"}>
                          {doc.status === "pending" ? "En attente" : 
                           doc.status === "verified" ? "Vérifié" : "Rejeté"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Vérifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Aucun document en attente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/documents">Tous les documents</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes système</CardTitle>
              <CardDescription>
                Problèmes détectés nécessitant une attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-alert/20 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-alert" />
                      </div>
                      <div>
                        <h4 className="font-medium">Serveur NTP désynchronisé</h4>
                        <p className="text-sm text-muted-foreground">
                          Dérive temporelle détectée sur le serveur principal
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Critique</Badge>
                  </div>
                  <div className="pl-10 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Détecté il y a 23 minutes
                    </div>
                    <Button size="sm">Résoudre</Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                        <Camera className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-medium">Caméra déconnectée</h4>
                        <p className="text-sm text-muted-foreground">
                          2 caméras ont perdu leur connexion dans la salle 203
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">
                      Moyenne
                    </Badge>
                  </div>
                  <div className="pl-10 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Détecté il y a 45 minutes
                    </div>
                    <Button size="sm">Résoudre</Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-neutral/20 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-neutral" />
                      </div>
                      <div>
                        <h4 className="font-medium">Détection de tentative d'intrusion</h4>
                        <p className="text-sm text-muted-foreground">
                          Plusieurs tentatives de connexion échouées depuis une IP inconnue
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Faible</Badge>
                  </div>
                  <div className="pl-10 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Détecté il y a 2 heures
                    </div>
                    <Button size="sm">Résoudre</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cameras">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance vidéo</CardTitle>
              <CardDescription>
                État des systèmes de surveillance vidéo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Salle d'examen 101</div>
                    <Badge className="bg-success">En ligne</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((cam) => (
                      <div key={cam} className="aspect-video rounded-md bg-muted relative overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/cam${cam}/640/360`} 
                          alt={`Camera ${cam}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                          Caméra {cam}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Salle d'examen 203</div>
                    <Badge variant="outline" className="text-warning border-warning">Partiel</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2].map((cam) => (
                      <div key={cam} className="aspect-video rounded-md bg-muted relative overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/cam2${cam}/640/360`} 
                          alt={`Camera ${cam}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                          Caméra {cam}
                        </div>
                      </div>
                    ))}
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Camera className="h-8 w-8 mb-2" />
                        <span className="text-xs">Déconnectée</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/video-monitoring">Système complet de surveillance</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
