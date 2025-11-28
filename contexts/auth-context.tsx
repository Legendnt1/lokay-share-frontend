"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Usuario, getUsuarioById } from "@/lib/api";

type AuthContextType = {
  currentUser: Usuario | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: Usuario | null) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const savedUserId = localStorage.getItem("currentUserId");
      if (savedUserId) {
        try {
          const user = await getUsuarioById(savedUserId);
          if (user) {
            setCurrentUserState(user);
          } else {
            // Usuario no encontrado, limpiar localStorage
            localStorage.removeItem("currentUserId");
          }
        } catch (error) {
          console.error("Error cargando usuario:", error);
          localStorage.removeItem("currentUserId");
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const setCurrentUser = (user: Usuario | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("currentUserId", user._id);
    } else {
      localStorage.removeItem("currentUserId");
    }
  };

  const logout = () => {
    setCurrentUserState(null);
    localStorage.removeItem("currentUserId");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        setCurrentUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
