import { createContext, useContext, useState, useEffect } from 'react';

import axiosClient from '../api/axiosClient';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check  user  auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
        //   const { data } = await axiosClient.get('/user');
        //data of user from localstorage
        const userData = localStorage.getItem('user');
        const data = JSON.parse(userData);

          console.log(data);
          setUser(data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);


   // roles
   const hasRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!user?.roles) return false;
    return requiredRoles.some(role => user.roles[0].name.includes(role));
  };


  const login = async (credentials) => {
    try {
      const { data } = await axiosClient.post('/admin/login', credentials);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (credentials) => {
    try {
      const { data } = await axiosClient.post('/register', credentials);
    
      localStorage.setItem('token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Register failed:', error);
      return { success: false, message: error.response?.data?.message || 'Register failed' };
    }
  };


  const logout = async () => {
    try {
      await axiosClient.post('/admin/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      delete axiosClient.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated,
      loading,
      hasRole,
      login,
      register,
      logout,
    }}
  >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);