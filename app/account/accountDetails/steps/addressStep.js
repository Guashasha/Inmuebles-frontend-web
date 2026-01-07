"use client";
import { useState, useEffect, useMemo } from "react";
import { useAccount } from "@context/AccountContext";
import { LOCATIONS } from "@constants";
import { useRouter } from "next/navigation";
import styles from "../account.module.css";

export default function AddressStep() {
  const { profile, saveChanges, setAlert } = useAccount();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    calle: "",
    noCalle: "",
    colonia: "",
    codigoPostal: "",
    ciudad: "",
    estado: "",
  });

  const loadDataFromProfile = () => {
    if (profile && profile.Direccion) {
      setFormData({
        calle: profile.Direccion.calle || "",
        noCalle: profile.Direccion.noCalle || "",
        colonia: profile.Direccion.colonia || "",
        codigoPostal: profile.Direccion.codigoPostal || "",
        ciudad: profile.Direccion.ciudad || "",
        estado: profile.Direccion.estado || "",
      });
    } else {
      setFormData({
        calle: "",
        noCalle: "",
        colonia: "",
        codigoPostal: "",
        ciudad: "",
        estado: "",
      });
    }
  };

  useEffect(() => {
    loadDataFromProfile();
  }, [profile]);

  const availableCities = useMemo(() => {
    const selectedLoc = LOCATIONS.find((l) => l.estado === formData.estado);
    return selectedLoc ? selectedLoc.ciudades : [];
  }, [formData.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "estado") {
      setFormData((prev) => ({ ...prev, estado: value, ciudad: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    loadDataFromProfile();
    setAlert({ type: "", message: "" });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    setAlert({ type: "", message: "" });
    const success = await saveChanges({
      direccion: {
        calle: formData.calle,
        noCalle: formData.noCalle,
        colonia: formData.colonia,
        codigoPostal: formData.codigoPostal,
        ciudad: formData.ciudad,
        estado: formData.estado,
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
          <label htmlFor="select-estado">Estado</label>
          <select
            id="select-estado"
            name="estado"
            value={formData.estado || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.input}
            autoComplete="address-level1"
            aria-required="true"
          >
            <option value="">Selecciona un estado</option>
            {LOCATIONS.map((l) => (
              <option key={l.estado} value={l.estado}>
                {l.estado}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="select-ciudad">Ciudad</label>
          <select
            id="select-ciudad"
            name="ciudad"
            value={formData.ciudad || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.estado}
            className={styles.input}
            autoComplete="address-level2"
            aria-required="true"
          >
            <option value="">Selecciona una ciudad</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
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
