"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@services/AuthService";
import Alert from "@components/alert/Alert";
import ReturnButton from "@components/returnButton/ReturnButton";
import styles from "./recovery.module.css";

export default function PasswordRecovery() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReturn = () => {
    router.back();
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!email) {
      setAlert({ type: "error", message: "Ingresa tu correo electrónico." });
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.requestPasswordReset(email);
      if (result.success) {
        setAlert({
          type: "success",
          message: "Código enviado. Revisa tu correo.",
        });
      } else {
        setAlert({ type: "error", message: result.error });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error al solicitar el código." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!token || !newPassword) {
      setAlert({
        type: "error",
        message: "Ingresa el código y la nueva contraseña.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.resetPassword(token, newPassword);
      if (result.success) {
        setAlert({
          type: "success",
          message: "Contraseña actualizada. Redirigiendo...",
        });
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setAlert({ type: "error", message: result.error });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Error al actualizar la contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backBtnWrapper}>
          <ReturnButton onClick={handleReturn} />
        </div>
        <h1 className={styles.title}>Recuperar contraseña</h1>
      </div>

      <div className={styles.alertContainer} aria-live="polite">
        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        )}
      </div>

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="instruction-1">
          <p id="instruction-1" className={styles.instruction}>
            1. Ingresa tu correo para recibir un código de restablecimiento.
          </p>
          <form onSubmit={handleRequestCode} className={styles.requestRow}>
            <input
              type="email"
              id="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading}
              autoComplete="email"
              aria-label="Correo electrónico para recuperación"
            />
            <button
              type="submit"
              className={styles.blackButtonSmall}
              disabled={loading}
            >
              {loading ? "..." : "Enviar código"}
            </button>
          </form>
        </section>

        <hr className={styles.divider} aria-hidden="true" />

        <section className={styles.section} aria-labelledby="instruction-2">
          <p id="instruction-2" className={styles.instruction}>
            2. Ingresa el código enviado a tu correo y tu nueva contraseña.
          </p>

          <div className={styles.resetGrid}>
            <form onSubmit={handleResetPassword} className={styles.formColumn}>
              <div className={styles.inputGroup}>
                <label
                  htmlFor="token-input"
                  style={{
                    marginBottom: "5px",
                    display: "block",
                    fontSize: "0.9rem",
                  }}
                >
                  Código de verificación
                </label>
                <input
                  type="text"
                  id="token-input"
                  placeholder="Ej. 123456"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              </div>
              <div className={styles.inputGroup}>
                <label
                  htmlFor="new-password"
                  style={{
                    marginBottom: "5px",
                    display: "block",
                    fontSize: "0.9rem",
                  }}
                >
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className={styles.blackButton}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>

            <div className={styles.requirementsText}>
              <p>Una contraseña segura consiste de los siguientes elementos:</p>
              <ul>
                <li>8 o más caracteres</li>
                <li>Al menos una letra minúscula</li>
                <li>Al menos una letra mayúscula</li>
                <li>Al menos 1 número</li>
                <li>
                  Al menos 1 símbolo especial: !#$%&()*+,-./:;&lt;=&gt;?@[\]^_
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
