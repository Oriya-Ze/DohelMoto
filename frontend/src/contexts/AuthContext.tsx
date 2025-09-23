import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  is_google_user: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.REACT_APP_API_URL_PUBLIC || 'http://localhost:8000';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        // Get user info after login
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });
        const userData = await userResponse.json();
        setUser(userData);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error(data.detail || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Generate username from email
      const username = email.split('@')[0];
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          full_name: name 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful registration, login the user
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          localStorage.setItem('token', loginData.access_token);
          setUser(data);
          toast.success('Account created successfully!');
          navigate('/');
        } else {
          toast.error('Registration successful but login failed');
        }
      } else {
        toast.error(data.detail || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const loginWithGoogle = async () => {
    try {
      // Redirect to Google OAuth
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loginWithGoogle,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
