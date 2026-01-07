"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@context/AccountContext";
import { validatePersonalData } from "@validators";
import { useUser } from "@context/UserContext";
import styles from "../account.module.css";

export default function PersonalStep() {
  const { profile, saveChanges, setAlert } = useAccount();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const { updateUser } = useUser();
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();

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
      updateUser({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
      });
    }
  };

  return (
    <form className={styles.stepContainer} onSubmit={handleSave}>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="input-nombre">Nombre (s)</label>
          <input
            id="input-nombre"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.nombre ? styles.inputError : ""
            }`}
            autoComplete="given-name"
            aria-invalid={!!errors.nombre}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="input-apellidos">Apellidos</label>
          <input
            id="input-apellidos"
            name="apellidos"
            value={formData.apellidos || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.apellidos ? styles.inputError : ""
            }`}
            autoComplete="family-name"
            aria-invalid={!!errors.apellidos}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="input-email">Correo electrónico</label>
          <input
            id="input-email"
            value={formData.email || ""}
            disabled
            className={`${styles.input} ${styles.disabled}`}
            autoComplete="email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="input-telefono">Teléfono celular</label>
          <input
            id="input-telefono"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.telefono ? styles.inputError : ""
            }`}
            autoComplete="tel"
            aria-invalid={!!errors.telefono}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="input-nacionalidad">Nacionalidad</label>
          <input
            id="input-nacionalidad"
            name="nacionalidad"
            value={formData.nacionalidad || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.nacionalidad ? styles.inputError : ""
            }`}
            autoComplete="country-name"
            aria-invalid={!!errors.nacionalidad}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="input-fecha">Fecha de nacimiento</label>
          <input
            id="input-fecha"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={`${styles.input} ${
              errors.fechaNacimiento ? styles.inputError : ""
            }`}
            autoComplete="bday"
            aria-invalid={!!errors.fechaNacimiento}
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
