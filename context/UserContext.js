"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthService from "@/services/AuthService";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = () => {
      const isAuthPage = pathname.startsWith("/auth/");

      if (isAuthPage) {
        AuthService.logout();
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const storedUser = AuthService.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoadingUser(false);
    };

    initAuth();
  }, [pathname]);

  async function login(email, password) {
    AuthService.logout();

    const result = await AuthService.login(email, password);

    if (result.success) {
      setUser(result.data.user);
    }

    return result;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
  }

  function updateUser(updates) {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  const contextValue = {
    user,
    loadingUser,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }

  return context;
}
