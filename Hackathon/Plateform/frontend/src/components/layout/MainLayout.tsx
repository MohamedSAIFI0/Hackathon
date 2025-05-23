
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { User, UserRole } from "@/types";

interface MainLayoutProps {
  allowedRoles?: UserRole[];
}

export const MainLayout = ({ allowedRoles }: MainLayoutProps) => {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if the user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard based on the user's role
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
