import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Alert Card Component
const AlertCardWithIcon = ({ title, count, icon, variant = "default" }) => {
  const { toast } = useToast();
  
  const getVariantStyles = () => {
    switch (variant) {
      case "warning": return "border-l-4 border-l-yellow-500";
      case "danger": return "border-l-4 border-l-red-500";
      case "success": return "border-l-4 border-l-green-500";
      case "info": return "border-l-4 border-l-blue-500";
      default: return "border-l-4 border-l-gray-500";
    }
  };

  const handleViewDetails = () => {
    toast({
      title: `Détails pour ${title}`,
      description: `${count} alertes de type "${title}" ont été détectées`,
    });
  };

  return (
    <Card className={`${getVariantStyles()} hover:shadow-md transition-shadow duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xl">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewDetails}>
          Voir détails
        </Button>
      </CardFooter>
    </Card>
  );
};

// Alert Pie Chart Component
const AlertPieChart = ({ data }) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Répartition des alertes</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Nombre d\'alertes']} 
              labelFormatter={(name) => `Type: ${name}`} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Alert Timeline Component
const AlertTimeline = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handlePointClick = (data) => {
    setSelectedPoint(data.activePayload[0].payload);
    setOpen(true);
  };

  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Chronologie des alertes</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onClick={handlePointClick}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorCount)"
                activeDot={{ r: 8, cursor: 'pointer' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails pour {selectedPoint?.time}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-lg font-medium">Nombre d'alertes: {selectedPoint?.count}</div>
            <div className="space-y-2">
              {selectedPoint?.details?.map((detail, i) => (
                <div key={i} className="bg-muted p-3 rounded-md">
                  <div className="font-semibold">{detail.type}</div>
                  <div className="text-sm text-muted-foreground">{detail.timestamp}</div>
                  {detail.evidence && (
                    <div className="mt-2 p-2 bg-background rounded border">
                      {detail.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Students Comparison Chart Component
const StudentsComparisonChart = ({ data }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Comparaison entre étudiants</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} alertes`, 'Nombre d\'alertes']} />
            <Bar dataKey="alerts">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isSuspicious ? '#ef4444' : '#3b82f6'} 
                  stroke={entry.isSuspicious ? '#b91c1c' : '#2563eb'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const AlertDashboard = () => {
  // Mock data for alert cards
  const alertData = [
    { title: "IA détectée", count: 15, icon: "🧠", variant: "danger" },
    { title: "Regard suspect (hors écran)", count: 22, icon: "👀", variant: "warning" },
    { title: "Visage absent", count: 12, icon: "🧍", variant: "warning" },
    { title: "Pas de commit GitHub > 10 min", count: 8, icon: "🧑‍💻", variant: "info" },
    { title: "Capture d'écran douteuse", count: 6, icon: "📸", variant: "danger" },
    { title: "Sortie de plateforme détectée", count: 3, icon: "📤", variant: "danger" },
  ];
  
  // Mock data for pie chart
  const pieChartData = [
    { name: "IA", value: 15, color: "#ef4444" },
    { name: "Regard suspect", value: 22, color: "#f97316" },
    { name: "Visage absent", value: 12, color: "#eab308" },
    { name: "Pas de commit", value: 8, color: "#3b82f6" },
    { name: "Capture d'écran", value: 6, color: "#8b5cf6" },
    { name: "Sortie plateforme", value: 3, color: "#ec4899" },
  ];

  // Mock data for timeline
  const timelineData = [
    { 
      time: "09:00", 
      count: 2,
      details: [
        { type: "Regard suspect", timestamp: "09:05", evidence: "Capture vidéo #12345" },
        { type: "Pas de commit GitHub", timestamp: "09:10", evidence: "Dernier commit à 08:50" }
      ]
    },
    { 
      time: "09:15", 
      count: 5,
      details: [
        { type: "IA détectée", timestamp: "09:18", evidence: "Texte copié depuis GPT" },
        { type: "Regard suspect", timestamp: "09:20", evidence: "Capture vidéo #12346" }
      ]
    },
    { 
      time: "09:30", 
      count: 8,
      details: [
        { type: "IA détectée", timestamp: "09:32", evidence: "Texte copié depuis GPT" },
        { type: "IA détectée", timestamp: "09:33", evidence: "Utilisation de code généré" }
      ]
    },
    { 
      time: "09:45", 
      count: 12,
      details: [
        { type: "Sortie plateforme", timestamp: "09:47", evidence: "Durée: 35 secondes" }
      ]
    },
    { 
      time: "10:00", 
      count: 15,
      details: [
        { type: "Visage absent", timestamp: "10:02", evidence: "Durée: 2 minutes" }
      ]
    },
    { 
      time: "10:15", 
      count: 10,
      details: [
        { type: "Pas de commit GitHub", timestamp: "10:18", evidence: "Dernier commit à 09:45" }
      ]
    },
    { 
      time: "10:30", 
      count: 7,
      details: [
        { type: "Regard suspect", timestamp: "10:32", evidence: "Capture vidéo #12350" }
      ]
    }
  ];

  // Mock data for students comparison
  const studentsData = [
    { name: "Étudiant A", alerts: 42, isSuspicious: true },
    { name: "Étudiant B", alerts: 27, isSuspicious: true },
    { name: "Étudiant C", alerts: 18, isSuspicious: false },
    { name: "Étudiant D", alerts: 12, isSuspicious: false },
    { name: "Étudiant E", alerts: 35, isSuspicious: true },
    { name: "Étudiant F", alerts: 8, isSuspicious: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord des alertes d'examen</h1>
        
        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {alertData.map((alert, index) => (
            <AlertCardWithIcon
              key={index}
              title={alert.title}
              count={alert.count}
              icon={alert.icon}
              variant={alert.variant}
            />
          ))}
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <AlertPieChart data={pieChartData} />
          <div className="col-span-3">
            <AlertTimeline data={timelineData} />
          </div>
        </div>
        
        {/* Students Comparison Chart */}
        <div className="mt-8">
          <StudentsComparisonChart data={studentsData} />
        </div>
      </div>
    </div>
  );
};

export default AlertDashboard;
