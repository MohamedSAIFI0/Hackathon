import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Clock, AlertCircle, Github } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// Seuil de temps considéré comme "suspect" entre deux commits (en minutes)
const DELAY_THRESHOLD = 15;

interface Commit {
  id: string;
  hash: string;
  message: string;
  author: string;
  date: string;
  url: string;
  timestamp: number;
}

interface CommitWithInterval extends Commit {
  timeInterval?: number; // en minutes
  isDelayed?: boolean;
}

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [commits, setCommits] = useState<CommitWithInterval[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCommits: 0,
    averageInterval: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  );

  // Fonction pour extraire le nom du repo depuis l'URL
  const extractRepoName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== "github.com") return "Repo GitHub";
      
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
      return "Repo GitHub";
    } catch (e) {
      return "Repo GitHub";
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Fonction pour calculer l'intervalle entre deux commits
  const calculateIntervals = (commits: Commit[]): CommitWithInterval[] => {
    if (commits.length <= 1) return commits as CommitWithInterval[];

    const sortedCommits = [...commits].sort(
      (a, b) => b.timestamp - a.timestamp
    );
    
    return sortedCommits.map((commit, index, array) => {
      if (index === array.length - 1) {
        return { ...commit };
      }
      
      const currentCommitTime = commit.timestamp;
      const nextCommitTime = array[index + 1].timestamp;
      const diffMinutes = Math.floor((currentCommitTime - nextCommitTime) / (1000 * 60));
      
      return {
        ...commit,
        timeInterval: diffMinutes,
        isDelayed: diffMinutes > DELAY_THRESHOLD,
      };
    });
  };

  // Fonction pour préparer les données du graphique
  const prepareChartData = (commits: Commit[]) => {
    const commitsPerDay = commits.reduce((acc: Record<string, number>, commit) => {
      const date = new Date(commit.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(commitsPerDay)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (commitWithIntervals: CommitWithInterval[]) => {
    const intervals = commitWithIntervals
      .filter((c) => c.timeInterval !== undefined)
      .map((c) => c.timeInterval as number);
    
    const totalCommits = commitWithIntervals.length;
    const averageInterval = intervals.length
      ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
      : 0;
    
    return {
      totalCommits,
      averageInterval,
    };
  };

  // Simulation de récupération des commits (dans une app réelle, ceci serait une API call)
  const fetchCommits = () => {
    if (!repoUrl.trim()) {
      setError("Veuillez entrer une URL de dépôt GitHub");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulons une requête API avec des données mock
    setTimeout(() => {
      try {
        // Données mockées pour la démonstration
        const mockCommits: Commit[] = [
          {
            id: "1",
            hash: "8f4ba6c",
            message: "Correction du bug d'affichage sur mobile",
            author: "Alice Martin",
            date: "2023-05-19T14:32:15Z",
            url: `${repoUrl}/commit/8f4ba6c`,
            timestamp: new Date("2023-05-19T14:32:15Z").getTime(),
          },
          {
            id: "2",
            hash: "3a7d9e2",
            message: "Ajout des fonctionnalités de filtrage",
            author: "Thomas Dupont",
            date: "2023-05-19T14:15:10Z",
            url: `${repoUrl}/commit/3a7d9e2`,
            timestamp: new Date("2023-05-19T14:15:10Z").getTime(),
          },
          {
            id: "3",
            hash: "5c2e8f1",
            message: "Mise à jour des dépendances",
            author: "Alice Martin",
            date: "2023-05-19T13:45:22Z",
            url: `${repoUrl}/commit/5c2e8f1`,
            timestamp: new Date("2023-05-19T13:45:22Z").getTime(),
          },
          {
            id: "4",
            hash: "9b3f7d2",
            message: "Refactoring du composant Dashboard",
            author: "Thomas Dupont",
            date: "2023-05-19T12:32:08Z",
            url: `${repoUrl}/commit/9b3f7d2`,
            timestamp: new Date("2023-05-19T12:32:08Z").getTime(),
          },
          {
            id: "5",
            hash: "6e1a9c3",
            message: "Initial commit",
            author: "Alice Martin",
            date: "2023-05-19T11:55:30Z",
            url: `${repoUrl}/commit/6e1a9c3`,
            timestamp: new Date("2023-05-19T11:55:30Z").getTime(),
          },
        ];

        const commitsWithIntervals = calculateIntervals(mockCommits);
        const calculatedStats = calculateStats(commitsWithIntervals);
        const chartData = prepareChartData(mockCommits);
        
        setCommits(commitsWithIntervals);
        setStats(calculatedStats);
        setChartData(chartData);
        setIsLoading(false);
      } catch (e) {
        setError("Erreur lors de la récupération des commits");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes Commits</h1>
      
      {/* Section de recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="URL du dépôt GitHub (ex: https://github.com/username/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={fetchCommits} 
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? "Chargement..." : "Analyser les commits"}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {commits.length > 0 && (
        <>
          {/* Lien vers le dépôt */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Dépôt: {extractRepoName(repoUrl)}
            </h2>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Github className="h-5 w-5" />
              Voir sur GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Section des statistiques */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nombre de commits:</span>
                    <span className="font-medium">{stats.totalCommits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Temps moyen entre commits:</span>
                    <span className="font-medium">{stats.averageInterval} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Évolution des commits</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip
                      formatter={(value: number) => [`${value} commits`, "Nombre"]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" name="Commits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Timeline des commits */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des commits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {commits.map((commit, index) => (
                  <div
                    key={commit.id}
                    className={`border-l-4 ${
                      commit.isDelayed ? "border-orange-500" : "border-blue-500"
                    } pl-4 py-2 relative`}
                  >
                    {/* Point sur la timeline */}
                    <div className="absolute left-[-9px] top-5 w-3.5 h-3.5 rounded-full bg-white border-4 border-blue-500"></div>
                    
                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-100">
                          {commit.hash}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(commit.date)}
                        </span>
                      </div>
                      <div>
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <span>Voir sur GitHub</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-medium mb-1">{commit.message}</h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-3">
                      <span className="text-muted-foreground">
                        Auteur: {commit.author}
                      </span>
                      
                      {commit.timeInterval !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {commit.timeInterval} minutes depuis le commit précédent
                          </span>
                          
                          {commit.isDelayed && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                              Retard suspect entre les commits
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Index;
