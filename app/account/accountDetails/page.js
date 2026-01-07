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
      <div className={styles.loadingContainer} aria-live="polite">
        <p>Cargando información de tu cuenta...</p>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.backBtnWrapper}>
          <ReturnButton onClick={handleReturn} />
        </div>
        <h1 className={styles.title}>Mi cuenta</h1>
      </div>

      <div className={styles.alertContainer} aria-live="assertive">
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      </div>

      <div className={styles.tabsContainer}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Secciones de la cuenta"
        >
          <button
            role="tab"
            id="tab-personal"
            aria-selected={activeTab === "personal"}
            aria-controls="panel-content"
            className={activeTab === "personal" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("personal")}
            tabIndex={activeTab === "personal" ? 0 : -1}
          >
            Información Personal
          </button>

          <button
            role="tab"
            id="tab-direccion"
            aria-selected={activeTab === "direccion"}
            aria-controls="panel-content"
            className={
              activeTab === "direccion" ? styles.tabActive : styles.tab
            }
            onClick={() => setActiveTab("direccion")}
            tabIndex={activeTab === "direccion" ? 0 : -1}
          >
            Dirección
          </button>

          <button
            role="tab"
            id="tab-fiscal"
            aria-selected={activeTab === "fiscal"}
            aria-controls="panel-content"
            className={activeTab === "fiscal" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("fiscal")}
            tabIndex={activeTab === "fiscal" ? 0 : -1}
          >
            Datos fiscales
          </button>

          {profile?.rol === "Cliente" && (
            <button
              role="tab"
              id="tab-preferencias"
              aria-selected={activeTab === "preferencias"}
              aria-controls="panel-content"
              className={
                activeTab === "preferencias" ? styles.tabActive : styles.tab
              }
              onClick={() => setActiveTab("preferencias")}
              tabIndex={activeTab === "preferencias" ? 0 : -1}
            >
              Preferencias
            </button>
          )}

          <button
            role="tab"
            id="tab-metodos"
            aria-selected={activeTab === "metodos"}
            aria-controls="panel-content"
            className={activeTab === "metodos" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("metodos")}
            tabIndex={activeTab === "metodos" ? 0 : -1}
          >
            Métodos de pago
          </button>
        </div>
      </div>

      <section
        id="panel-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={styles.contentArea}
      >
        {activeTab === "personal" && <PersonalStep />}
        {activeTab === "direccion" && <AddressStep />}
        {activeTab === "fiscal" && <FiscalStep />}
        {activeTab === "preferencias" && <PreferencesStep />}
        {activeTab === "metodos" && <PaymentStep />}
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <AccountProvider>
      <AccountContent />
    </AccountProvider>
  );
}
