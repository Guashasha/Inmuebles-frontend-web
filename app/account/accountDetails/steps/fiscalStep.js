"use client";
import { useState, useEffect } from "react";
import { useAccount } from "@context/AccountContext";
import { validateFiscalData } from "@validators";
import { useRouter } from "next/navigation";
import styles from "../account.module.css";

export default function FiscalStep() {
  const { profile, saveChanges, setAlert } = useAccount();
  const router = useRouter();

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();

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
    <form className={styles.stepContainer} onSubmit={handleSave}>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="rfc-input">RFC</label>
          <input
            id="rfc-input"
            name="rfc"
            value={formData.rfc || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Ej. VECJ880326XXX"
            className={`${styles.input} ${errors.rfc ? styles.inputError : ""}`}
            maxLength={13}
            autoComplete="off"
            aria-invalid={!!errors.rfc}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.push("/account/changePassword")}
        >
          Cambiar Contraseña
        </button>

        {isEditing ? (
          <div className={styles.editActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.btnCancel}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              Guardar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={styles.btnEdit}
          >
            Editar
          </button>
        )}
      </div>
    </form>
  );
}
