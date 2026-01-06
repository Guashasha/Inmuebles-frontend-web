"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AccountService from "@services/AccountService";
import Alert from "@components/alert/Alert";
import { validatePassword } from "@validators";
import styles from "./changePassword.module.css";

const EyeIcon = ({ visible, onClick }) => (
  <button type="button" onClick={onClick} className={styles.eyeButton}>
    <Image
      src={visible ? "/icons/eye.svg" : "/icons/eye-off.svg"}
      alt={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      width={20}
      height={20}
    />
  </button>
);

export default function ChangePassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
      setAlert({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setErrors({});
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es obligatoria.";
    }

    const formatError = validatePassword(formData.newPassword);
    if (formatError) {
      newErrors.newPassword = formatError;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas nuevas no coinciden.";
    }

    if (
      formData.currentPassword === formData.newPassword &&
      formData.newPassword
    ) {
      newErrors.newPassword =
        "La nueva contraseña debe ser diferente a la actual.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({ type: "error", message: Object.values(newErrors)[0] });
      return;
    }

    setLoading(true);
    try {
      const result = await AccountService.changePassword(formData);
      if (result.success) {
        setAlert({
          type: "success",
          message: "Contraseña actualizada correctamente.",
        });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => router.push("/account/accountDetails"), 2000);
        setAlert({
          type: "error",
          message: result.message || result.error || "Error al actualizar.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Error de conexión." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cambiar contraseña</h1>
      </div>

      <div className={styles.alertContainer}>
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label}>Ingresa tu contraseña actual</label>
            <div className={styles.inputWrapper}>
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="****************"
                className={`${styles.input} ${
                  errors.currentPassword ? styles.inputError : ""
                }`}
                disabled={loading}
              />
              <EyeIcon
                visible={showCurrent}
                onClick={() => setShowCurrent(!showCurrent)}
              />
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.bottomGrid}>
            <div className={styles.leftColumn}>
              <label className={styles.label}>
                Ingresa tu contraseña nueva
              </label>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Contraseña nueva"
                    className={`${styles.input} ${
                      errors.newPassword ? styles.inputError : ""
                    }`}
                    disabled={loading}
                  />
                  <EyeIcon
                    visible={showNew}
                    onClick={() => setShowNew(!showNew)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmación de contraseña nueva"
                    className={`${styles.input} ${
                      errors.confirmPassword ? styles.inputError : ""
                    }`}
                    disabled={loading}
                  />
                  <EyeIcon
                    visible={showConfirm}
                    onClick={() => setShowConfirm(!showConfirm)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </div>

            <div className={styles.requirementsColumn}>
              <p className={styles.reqTitle}>
                Una contraseña segura consiste de los siguientes elementos:
              </p>
              <ul className={styles.reqList}>
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
        </form>
      </div>
    </div>
  );
}
