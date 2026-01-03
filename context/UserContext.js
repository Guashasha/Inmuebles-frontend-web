"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // TODO mostrar menos errores producción
      console.error("Error cargando los datos del usuario: ", error);
      localStorage.removeItem("user_data");
    }
  }, []);

  function login(userCredentials) {
    // TODO obtener datos desde el API
    const userData = {
      id: 1,
      name: "John Doe",
    };

    localStorage.setItem("user_data", JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("user_data");
    setUser(null);
  }

  function updateUser(updates) {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  const contextValue = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  
  return context;
}