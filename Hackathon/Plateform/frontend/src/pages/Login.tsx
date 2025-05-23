
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { mockUsers } from "@/data/mockData";

export const Login = () => {
  const { isAuthenticated, user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already authenticated, redirect to the dashboard based on user role
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // For demo purposes, we'll add quick login buttons
  const handleQuickLogin = async (userType: "student" | "professor" | "admin") => {
    let demoUser;
    
    switch (userType) {
      case "student":
        demoUser = mockUsers.find((u) => u.role === "student");
        break;
      case "professor":
        demoUser = mockUsers.find((u) => u.role === "professor");
        break;
      case "admin":
        demoUser = mockUsers.find((u) => u.role === "admin");
        break;
    }
    
    if (demoUser) {
      await login(demoUser.email, "password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">ExamGuard Pro</CardTitle>
          <CardDescription>
            Plateforme de surveillance et d'évaluation des examens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center w-full">
            Pour démonstration, connexion rapide en tant que:
          </div>
          <div className="flex gap-2 justify-center w-full">
            <Button
              variant="outline"
              onClick={() => handleQuickLogin("student")}
              className="border-student text-student hover:bg-student hover:text-white flex-1"
            >
              Étudiant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin("professor")}
              className="border-professor text-professor hover:bg-professor hover:text-white flex-1"
            >
              Professeur
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickLogin("admin")}
              className="border-admin text-admin hover:bg-admin hover:text-white flex-1"
            >
              Admin
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
