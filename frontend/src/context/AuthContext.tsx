import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the Officer (user)
export type Officer = {
  departmentName: string;
  badgeNumber: string;
  password: string;
  uid: string;
};

type AuthContextType = {
  user: Officer | null;
  setUser: React.Dispatch<React.SetStateAction<Officer | null>>;
  logout: () => void; // Add logout function to the context type
};

// Create the AuthContext and export it
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Officer | null>(null);

  // Logout function implementation
  const logout = () => {
    setUser(null); // Clear the user state
    localStorage.removeItem('departmentName'); // Optional: Remove departmentName from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; // Now it returns user, setUser, and logout
};
