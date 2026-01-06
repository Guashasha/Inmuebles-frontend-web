"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AccountService from "@services/AccountService";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const result = await AccountService.getProfile();

    if (result.success) {
      setProfile(result.data);
    } else {
      setAlert({
        type: "error",
        message: "Error al cargar la información del perfil.",
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveChanges = async (payload) => {
    setAlert({ type: "", message: "" });

    const result = await AccountService.updateProfile(payload);

    if (result.success) {
      setProfile(result.data);
      setAlert({
        type: "success",
        message: "Información actualizada correctamente.",
      });
      return true;
    } else {
      setAlert({
        type: "error",
        message: result.error || "Error al actualizar el perfil.",
      });
      return false;
    }
  };

  const value = {
    profile,
    loading,
    activeTab,
    setActiveTab,
    saveChanges,
    alert,
    setAlert,
    refreshProfile: fetchProfile,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context)
    throw new Error("useAccount must be used within AccountProvider");
  return context;
};
