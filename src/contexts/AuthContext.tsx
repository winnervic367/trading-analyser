
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, User } from "@/services/authService";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = loginUser(email, password);
      setUser(loggedInUser);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const newUser = registerUser(email, password, name);
      setUser(newUser);
      toast.success("Registration successful");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
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
