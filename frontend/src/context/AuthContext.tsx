import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface CustomSport {
  name: string;
  icon: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  preferredSports: string[];
  customSports: CustomSport[];
  weeklyGoal: number;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  updateUser(userData: User): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem('@App:user');
      const storageToken = localStorage.getItem('@App:token');

      if (storageUser && storageToken) {
        const parsedUser = JSON.parse(storageUser);
        setUser({
          ...parsedUser,
          preferredSports: parsedUser.preferredSports || [],
          customSports: parsedUser.customSports || [],
          weeklyGoal: parsedUser.weeklyGoal || 3
        });
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    
    const { token, id, name, gender, preferredSports, customSports, weeklyGoal } = response.data;
    
    const userData = { 
      id, 
      name, 
      email: response.data.email, 
      gender, 
      preferredSports: preferredSports || [],
      customSports: customSports || [],
      weeklyGoal: weeklyGoal || 3
    };

    setUser(userData);
    localStorage.setItem('@App:user', JSON.stringify(userData));
    localStorage.setItem('@App:token', token);
  }

  function updateUser(userData: User) {
    setUser(userData);
    localStorage.setItem('@App:user', JSON.stringify(userData));
  }

  function signOut() {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, updateUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
