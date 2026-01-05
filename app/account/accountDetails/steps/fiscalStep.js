"use client";
import { useState, useEffect } from "react";
import { useAccount } from "@context/AccountContext";
import { validateFiscalData } from "@validators";
import styles from "../account.module.css";

export default function FiscalStep() {
  const { profile, saveChanges, setAlert } = useAccount();

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rfc: "",
  });

  const loadDataFromProfile = () => {
    if (profile) {
      setFormData({
        rfc: profile.rfc || profile.Arrendador?.rfc || "",
      });
      setErrors({});
    }
  };

  useEffect(() => {
    loadDataFromProfile();
  }, [profile]);

  const handleChange = (e) => {
    const value =
      e.target.name === "rfc" ? e.target.value.toUpperCase() : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
      setAlert({ type: "", message: "" });
    }
  };

  const handleCancel = () => {
    loadDataFromProfile();
    setErrors({});
    setAlert({ type: "", message: "" });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setAlert({ type: "", message: "" });
    const { isValid, errors: validationErrors } = validateFiscalData(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorMessage = Object.values(validationErrors)[0];
      setAlert({ type: "error", message: firstErrorMessage });
      return;
    }

    const success = await saveChanges({
      rfc: formData.rfc,
    });

    if (success) {
      setIsEditing(false);
      setErrors({});
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>RFC</label>
          <input
            name="rfc"
            value={formData.rfc || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Ej. VECJ880326XXX"
            className={`${styles.input} ${errors.rfc ? styles.inputError : ""}`}
            maxLength={13}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/account/changePassword")}
        >
          Cambiar Contraseña
        </button>
        {isEditing ? (
          <div className={styles.editActions}>
            <button onClick={handleCancel} className={styles.btnCancel}>
              Cancelar
            </button>
            <button onClick={handleSave} className={styles.btnSave}>
              Guardar
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
