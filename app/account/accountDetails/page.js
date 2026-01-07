"use client";

import { useRouter } from "next/navigation";
import { AccountProvider, useAccount } from "@context/AccountContext";
import Alert from "@components/alert/Alert";
import ReturnButton from "@components/returnButton/ReturnButton";
import PersonalStep from "./steps/personalStep";
import AddressStep from "./steps/addressStep";
import FiscalStep from "./steps/fiscalStep";
import PreferencesStep from "./steps/preferencesStep";
import PaymentStep from "./steps/paymentStep";
import styles from "./account.module.css";

function AccountContent() {
  const router = useRouter();
  const { activeTab, setActiveTab, loading, profile, alert, setAlert } =
    useAccount();

  const handleReturn = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando información de tu cuenta...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.backBtnWrapper}>
          <ReturnButton onClick={handleReturn} />
        </div>
        <h1 className={styles.title}>Mi cuenta</h1>
      </div>

      <div className={styles.alertContainer}>
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={activeTab === "personal" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("personal")}
          >
            Información Personal
          </button>
          <button
            className={
              activeTab === "direccion" ? styles.tabActive : styles.tab
            }
            onClick={() => setActiveTab("direccion")}
          >
            Dirección
          </button>
          <button
            className={activeTab === "fiscal" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("fiscal")}
          >
            Datos fiscales
          </button>
          {profile?.rol === "Cliente" && (
            <button
              className={
                activeTab === "preferencias" ? styles.tabActive : styles.tab
              }
              onClick={() => setActiveTab("preferencias")}
            >
              Preferencias
            </button>
          )}
          <button
            className={activeTab === "metodos" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("metodos")}
          >
            Métodos de pago
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {activeTab === "personal" && <PersonalStep />}
        {activeTab === "direccion" && <AddressStep />}
        {activeTab === "fiscal" && <FiscalStep />}
        {activeTab === "preferencias" && <PreferencesStep />}
        {activeTab === "metodos" && <PaymentStep />}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AccountProvider>
      <AccountContent />
    </AccountProvider>
  );
}
