"use client";
import { useState } from "react";
import { usePropertyCreation } from "@context/PropertyContext";
import { PROPERTY_TYPES } from "@constants";
import { validatePropertyBasicInfo } from "@validators";
import Alert from "@components/alert/Alert";
import styles from "../property.module.css";

export default function BasicInfoStep() {
  const { propertyData, updatePropertyData, nextStep } = usePropertyCreation();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });

  const validate = () => {
    const result = validatePropertyBasicInfo(propertyData);
    if (!result.isValid) {
      setErrors(result.errors);
      setAlert({
        type: "error",
        message: "Por favor completa los campos obligatorios marcados en rojo.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setAlert({ type: "", message: "" });
    setErrors({});

    if (validate()) {
      nextStep();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePropertyData(null, name, value);
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handlePhysicalChange = (e) => {
    const { name, value } = e.target;
    const finalValue = value === "" ? "" : Number(value);

    updatePropertyData("detallesFisicos", name, finalValue);

    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleCheckboxChange = (e) => {
    updatePropertyData(
      "detallesFisicos",
      "mascotasPermitidas",
      e.target.checked
    );
  };

  const handleCategoryChange = (e) => {
    const catId = Number(e.target.value);
    setSelectedCategoryId(catId);
    updatePropertyData(null, "subtipoId", "");
  };

  const handleSubtypeChange = (e) => {
    updatePropertyData(null, "subtipoId", Number(e.target.value));
    if (errors.subtipoId) setErrors({ ...errors, subtipoId: null });
  };

  const activeSubtypes = selectedCategoryId
    ? PROPERTY_TYPES.find((c) => c.id === selectedCategoryId)?.subtypes || []
    : [];

  return (
    <div className={styles.stepContainer}>
      {alert.message && (
        <div style={{ marginBottom: "20px" }}>
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.inputGroup}>
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={propertyData.titulo}
            onChange={handleChange}
            placeholder="Casa moderna en Av. Xalapa"
            className={`${styles.input} ${
              errors.titulo ? styles.inputError : ""
            }`}
          />
          {errors.titulo && (
            <span className={styles.errorMessage}>{errors.titulo}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Número de recámaras</label>
          <input
            type="number"
            name="numRecamaras"
            value={propertyData.detallesFisicos.numRecamaras}
            onChange={handlePhysicalChange}
            className={`${styles.input} ${
              errors.numRecamaras ? styles.inputError : ""
            }`}
            min="0"
          />
          {errors.numRecamaras && (
            <span className={styles.errorMessage}>{errors.numRecamaras}</span>
          )}
        </div>

        <div className={styles.inputGroupFull}>
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={propertyData.descripcion}
            onChange={handleChange}
            placeholder="Descripción completa del inmueble..."
            className={`${styles.textarea} ${
              errors.descripcion ? styles.inputError : ""
            }`}
            rows={4}
          />
          {errors.descripcion && (
            <span className={styles.errorMessage}>{errors.descripcion}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Categoría</label>
          <select
            className={styles.input}
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {PROPERTY_TYPES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Subtipo</label>
          <select
            name="subtipoId"
            value={propertyData.subtipoId}
            onChange={handleSubtypeChange}
            className={`${styles.input} ${
              errors.subtipoId ? styles.inputError : ""
            }`}
            disabled={!selectedCategoryId}
          >
            <option value="" disabled>
              {selectedCategoryId
                ? "Selecciona un subtipo"
                : "Primero selecciona categoría"}
            </option>
            {activeSubtypes.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.label}
              </option>
            ))}
          </select>
          {errors.subtipoId && (
            <span className={styles.errorMessage}>{errors.subtipoId}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Superficie construida (m²)</label>
          <input
            type="number"
            name="superficieConstruida"
            value={propertyData.detallesFisicos.superficieConstruida}
            onChange={handlePhysicalChange}
            className={`${styles.input} ${
              errors.superficieConstruida ? styles.inputError : ""
            }`}
            min="0"
          />
          {errors.superficieConstruida && (
            <span className={styles.errorMessage}>
              {errors.superficieConstruida}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Superficie total (m²)</label>
          <input
            type="number"
            name="superficieTotal"
            value={propertyData.detallesFisicos.superficieTotal}
            onChange={handlePhysicalChange}
            className={`${styles.input} ${
              errors.superficieTotal ? styles.inputError : ""
            }`}
            min="0"
          />
          {errors.superficieTotal && (
            <span className={styles.errorMessage}>
              {errors.superficieTotal}
            </span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Antigüedad</label>
          <input
            type="number"
            name="antiguedad"
            placeholder="En años (Ejemplo: 5)"
            value={propertyData.detallesFisicos.antiguedad || ""}
            onChange={handlePhysicalChange}
            className={`${styles.input} ${
              errors.antiguedad ? styles.inputError : ""
            }`}
            min="0"
          />
          {errors.antiguedad && (
            <span className={styles.errorMessage}>{errors.antiguedad}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Piso de ubicación (opcional)</label>
          <input
            type="text"
            name="pisoUbicacion"
            placeholder="Ej: 3"
            value={propertyData.detallesFisicos.pisoUbicacion || ""}
            onChange={(e) =>
              updatePropertyData(
                "detallesFisicos",
                "pisoUbicacion",
                e.target.value
              )
            }
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Número de baños</label>
          <input
            type="number"
            name="numBaños"
            value={propertyData.detallesFisicos.numBaños}
            onChange={handlePhysicalChange}
            className={`${styles.input} ${
              errors.numBaños ? styles.inputError : ""
            }`}
            min="0"
          />
          {errors.numBaños && (
            <span className={styles.errorMessage}>{errors.numBaños}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>Número de medios baños</label>
          <input
            type="number"
            name="numMediosBaños"
            value={propertyData.detallesFisicos.numMediosBaños}
            onChange={handlePhysicalChange}
            className={styles.input}
            min="0"
          />
        </div>

        <div className={styles.inputGroupFull}>
          <label>Referencias (opcional)</label>
          <textarea
            name="referencias"
            placeholder="Se encuentra ubicado frente a escuela primaria..."
            value={propertyData.referencias || ""}
            onChange={handleChange}
            className={styles.textarea}
            rows={2}
          />
        </div>

        <div
          className={styles.inputGroupFull}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={propertyData.detallesFisicos.mascotasPermitidas}
              onChange={handleCheckboxChange}
              style={{ width: "18px", height: "18px", accentColor: "#000" }}
            />
            Se permiten mascotas
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnSecondary} disabled>
          Regresar
        </button>
        <button onClick={handleNext} className={styles.btnPrimary}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
