"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@context/AccountContext";
import { validatePersonalData } from "@validators";
import styles from "../account.module.css";

export default function PersonalStep() {
  const { profile, saveChanges, setAlert } = useAccount();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    nacionalidad: "",
    fechaNacimiento: "",
  });

  const loadDataFromProfile = () => {
    if (profile) {
      setFormData({
        nombre: profile.nombre || "",
        apellidos: profile.apellidos || "",
        email: profile.correoElectronico || "",
        telefono: profile.telefono || "",
        nacionalidad: profile.nacionalidad || "",
        fechaNacimiento: profile.fechaNacimiento
          ? profile.fechaNacimiento.split("T")[0]
          : "",
      });
      setErrors({});
    }
  };

  useEffect(() => {
    loadDataFromProfile();
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    const { isValid, errors: validationErrors } =
      validatePersonalData(formData);

    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorMessage = Object.values(validationErrors)[0];
      setAlert({ type: "error", message: firstErrorMessage });

      return;
    }

    const success = await saveChanges({
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      nacionalidad: formData.nacionalidad,
      fechaNacimiento: formData.fechaNacimiento,
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
          <label>Nombre (s)</label>
          <input
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.nombre ? styles.inputError : ""
            }`}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Apellidos</label>
          <input
            name="apellidos"
            value={formData.apellidos || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.apellidos ? styles.inputError : ""
            }`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Correo electrónico</label>
          <input
            value={formData.email || ""}
            disabled
            className={`${styles.input} ${styles.disabled}`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Teléfono celular</label>
          <input
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.telefono ? styles.inputError : ""
            }`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Nacionalidad</label>
          <input
            name="nacionalidad"
            value={formData.nacionalidad || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.nacionalidad ? styles.inputError : ""
            }`}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.fechaNacimiento ? styles.inputError : ""
            }`}
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
