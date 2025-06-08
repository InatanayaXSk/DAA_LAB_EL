import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string, rollNumber?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'faculty',
    department: 'Computer Science'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@student.university.edu',
    role: 'student',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    year: 3,
    section: 'A'
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.university.edu',
    role: 'student',
    rollNumber: 'CS2022001',
    department: 'Computer Science',
    year: 2,
    section: 'B'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('exam_system_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string, rollNumber?: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    // For students, also check roll number
    if (role === 'student' && foundUser && rollNumber) {
      if (foundUser.rollNumber !== rollNumber) {
        foundUser = undefined; // Invalid roll number
      }
    }
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('exam_system_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('exam_system_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};