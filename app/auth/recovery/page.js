"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthService from "@/services/AuthService";
import Alert from "@components/alert/Alert";
import styles from "./recovery.module.css";

export default function PasswordRecovery() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recuperar contraseña</h1>
      </div>

      <div className={styles.alertContainer}>
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <p className={styles.instruction}>
            Ingresa tu correo para recibir un código de restablecimiento.
          </p>
          <form onSubmit={handleRequestCode} className={styles.requestRow}>
            <input
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.blackButtonSmall}
              disabled={loading}
            >
              {loading ? "..." : "Enviar código"}
            </button>
          </form>
        </div>

        <hr className={styles.divider} />

        <div className={styles.section}>
          <p className={styles.instruction}>
            Ingresa el código enviado a tu correo y tu nueva contraseña.
          </p>

          <div className={styles.resetGrid}>
            <form onSubmit={handleResetPassword} className={styles.formColumn}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Pega el código aquí"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
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
        </div>
      </div>
    </div>
  );
}
