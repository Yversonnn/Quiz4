import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock user state - in production, this would come from actual auth
  const [user, setUser] = useState({
    id: 'user-1',
    name: 'Admin User',
    role: 'ADMIN', // ADMIN, MANAGER, USER
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const hasRole = useCallback((roles) => {
    if (!isAuthenticated || !user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  }, [isAuthenticated, user]);

  const canAccessFeature = useCallback((requiredRole) => {
    const roleHierarchy = {
      ADMIN: 3,
      MANAGER: 2,
      USER: 1,
    };
    return roleHierarchy[user?.role] >= roleHierarchy[requiredRole];
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
    canAccessFeature,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
