import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/ui/Loader.jsx";

export const AppContext = createContext(null);

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logout berhasil!');
    navigate('/login'); 
  }, [navigate]);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error("Token tidak valid, sesi habis.", error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUserOnLoad();
  }, [token, logout]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    toast.success('Login berhasil, selamat datang!');
    navigate('/dashboard'); 
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AppContext.Provider value={value}>
      <Toaster />
      {children}
    </AppContext.Provider>
  );
};