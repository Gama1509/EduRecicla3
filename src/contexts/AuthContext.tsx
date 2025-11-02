"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ⚡ Inicialización directa desde localStorage (sin useEffect)
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const initialToken = storedToken || null;

  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!initialUser && !!initialToken
  );

  const login = (userData: User, jwt: string) => {
    setUser(userData);
    setToken(jwt);
    setIsLoggedIn(true);

    // Guardar en localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
