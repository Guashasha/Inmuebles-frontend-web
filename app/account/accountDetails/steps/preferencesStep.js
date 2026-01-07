"use client";
import { useState, useEffect } from "react";
import { useAccount } from "@context/AccountContext";
import { PROPERTY_CATEGORIES } from "@constants";
import { useRouter } from "next/navigation";
import styles from "../account.module.css";

export default function PreferencesStep() {
  const { profile, saveChanges, setAlert } = useAccount();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    presupuestoMin: "",
    presupuestoMax: "",
    idCategoria: PROPERTY_CATEGORIES[0].id,
  });

  const loadDataFromProfile = () => {
    if (profile && profile.Cliente && profile.Cliente.Preferencias) {
      const prefs = profile.Cliente.Preferencias;
      setFormData({
        presupuestoMin: prefs.presupuestoMin || "",
        presupuestoMax: prefs.presupuestoMax || "",
        idCategoria: prefs.idCategoria
          ? String(prefs.idCategoria)
          : PROPERTY_CATEGORIES[0].id,
      });
    } else {
      setFormData({
        presupuestoMin: "",
        presupuestoMax: "",
        idCategoria: PROPERTY_CATEGORIES[0].id,
      });
    }
  };

  useEffect(() => {
    loadDataFromProfile();
  }, [profile]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCancel = () => {
    loadDataFromProfile();
    setAlert({ type: "", message: "" });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    setAlert({ type: "", message: "" });

    const success = await saveChanges({
      preferencias: {
        presupuestoMin:
          formData.presupuestoMin !== "" ? Number(formData.presupuestoMin) : 0,
        presupuestoMax: formData.presupuestoMax
          ? parseFloat(formData.presupuestoMax)
          : 100000000,
        idCategoria: parseInt(formData.idCategoria),
      },
    });

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <form className={styles.stepContainer} onSubmit={handleSave}>
      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label htmlFor="min-price">Presupuesto mínimo</label>
          <input
            id="min-price"
            type="number"
            name="presupuestoMin"
            value={formData.presupuestoMin || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
            placeholder="0"
            min="0"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="max-price">Presupuesto máximo</label>
          <input
            id="max-price"
            type="number"
            name="presupuestoMax"
            value={formData.presupuestoMax || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
            placeholder="Sin límite"
            min="0"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="category-select">Categoría de interés</label>
          <select
            id="category-select"
            name="idCategoria"
            value={formData.idCategoria || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
          >
            {PROPERTY_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
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
