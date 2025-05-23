import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Call backend API (use full URL for dev, or relative for prod)
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: email, password }),
      });

      if (!response.ok) {
        setError("Email ou mot de passe incorrect");
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const userData = await response.json();

      // Map backend user type to frontend role
      let role: UserRole = "student";
      if (userData.type === 1) role = "professor";
      if (userData.type === 2) role = "admin";

      const user = {
        id: String(userData.id),
        name: userData.login,
        email: userData.login,
        role,
      };

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Connecté avec succès",
        description: `Bienvenue, ${user.name}!`,
      });
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
