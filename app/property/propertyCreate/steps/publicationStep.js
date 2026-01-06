"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePropertyCreation } from "@context/PropertyContext";
import { validatePropertyPublication } from "@validators";
import {
  createProperty,
  uploadPropertyImages,
} from "@services/PropertyService";
import Alert from "@components/alert/Alert";
import styles from "../property.module.css";

export default function PublicationStep() {
  const { propertyData, updatePropertyData, prevStep } = usePropertyCreation();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });

  const pubData = propertyData.publicacion;
  const isVenta = pubData.tipoOperacion === "Venta";

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "precio",
      "montoDeposito",
      "plazoMinimoMeses",
      "plazoMaximoMeses",
    ];

    const val = numericFields.includes(name)
      ? value === ""
        ? ""
        : Number(value)
      : value;

    updatePropertyData("publicacion", name, val);
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleToggle = (name) => {
    updatePropertyData("publicacion", name, !pubData[name]);
    if (name === "depositoRequerido" && errors.montoDeposito) {
      setErrors({ ...errors, montoDeposito: null });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      if (files.length + newFiles.length > 5) {
        setAlert({
          type: "error",
          message: "Solo puedes subir un máximo de 5 imágenes.",
        });
        return;
      }

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFiles((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      setAlert({ type: "", message: "" });
    }
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatedPriceM2 =
    isVenta && propertyData.detallesFisicos.superficieTotal > 0
      ? (pubData.precio / propertyData.detallesFisicos.superficieTotal).toFixed(
          2
        )
      : 0;

  const validate = () => {
    const result = validatePropertyPublication(propertyData);
    let isValid = result.isValid;
    const newErrors = { ...result.errors };

    if (files.length === 0) {
      setAlert({
        type: "error",
        message: "Debes subir al menos una foto para publicar.",
      });
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setAlert({
          type: "error",
          message: "Por favor corrige los campos marcados en rojo.",
        });
      }
      return false;
    }
    return true;
  };

  const handleFinalize = async () => {
    if (!validate()) return;

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Tu sesión ha expirado.");

      const userId = JSON.parse(atob(token.split(".")[1])).idUsuario;

      const payload = {
        ...propertyData,
        arrendadorId: userId,
      };

      const dataProp = await createProperty(payload);
      const newPropertyId = dataProp.propertyId || dataProp.data?.idPropiedad;

      if (files.length > 0 && newPropertyId) {
        try {
          await uploadPropertyImages(newPropertyId, files);
        } catch (imgError) {
          console.warn("Error en imágenes:", imgError);
          setAlert({
            type: "warning",
            message:
              "Propiedad creada, pero hubo problemas subiendo las fotos.",
          });
          setLoading(false);
          return;
        }
      }

      setAlert({
        type: "success",
        message: "¡Propiedad publicada exitosamente!",
      });
      setTimeout(() => {
        router.push("/dashboard/my-properties");
      }, 2000);
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.message || "Error al conectar con el servidor.",
      });
      setLoading(false);
    }
  };

  return (
    <div className={styles.stepContainer}>
      {alert.message && (
        <div className={styles.alertContainer}>
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.leftColumnForm}>
          <div className={styles.inputGroup}>
            <label>Tipo de operación</label>
            <select
              name="tipoOperacion"
              value={pubData.tipoOperacion}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="Renta">Renta</option>
              <option value="Venta">Venta</option>
            </select>
          </div>

          <div className={styles.rowInputs}>
            <div className={styles.inputGroup} style={{ flex: 2 }}>
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={pubData.precio || ""}
                onChange={handleChange}
                placeholder="0.00"
                className={`${styles.input} ${
                  errors.precio ? styles.inputError : ""
                }`}
                min="0"
              />
              {errors.precio && (
                <span className={styles.errorMessage}>{errors.precio}</span>
              )}
            </div>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <label>Divisa</label>
              <select
                name="divisa"
                value={pubData.divisa}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {isVenta ? (
            <div className={styles.inputGroup}>
              <label>Precio por metro cuadrado (m²)</label>
              <input
                type="text"
                value={calculatedPriceM2}
                readOnly
                className={`${styles.input} ${styles.readOnlyInput}`}
                placeholder="Se calcula automático"
              />
              <span className={styles.helperText}>
                Calculado con superficie total (
                {propertyData.detallesFisicos.superficieTotal} m²)
              </span>
            </div>
          ) : (
            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label>Plazo mínimo (meses)</label>
                <input
                  type="number"
                  name="plazoMinimoMeses"
                  value={pubData.plazoMinimoMeses || ""}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Plazo máximo (meses)</label>
                <input
                  type="number"
                  name="plazoMaximoMeses"
                  value={pubData.plazoMaximoMeses || ""}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                />
              </div>
            </div>
          )}

          <div className={styles.depositSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="radio"
                checked={pubData.depositoRequerido || false}
                onClick={() => handleToggle("depositoRequerido")}
                readOnly
                className={styles.radioInput}
              />
              Depósito requerido
            </label>

            {pubData.depositoRequerido && (
              <div className={styles.depositInputContainer}>
                <input
                  type="number"
                  name="montoDeposito"
                  placeholder="Monto"
                  value={pubData.montoDeposito || ""}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.smallInput} ${
                    errors.montoDeposito ? styles.inputError : ""
                  }`}
                  min="0"
                />
              </div>
            )}
          </div>
          {errors.montoDeposito && (
            <span
              className={styles.errorMessage}
              style={{ marginTop: "-10px", marginBottom: "10px" }}
            >
              {errors.montoDeposito}
            </span>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="radio"
                checked={pubData.requiereAval || false}
                onClick={() => handleToggle("requiereAval")}
                readOnly
                className={styles.radioInput}
              />
              Requiere aval
            </label>
          </div>
        </div>

        <div className={styles.uploadContainer}>
          {files.length < 5 && (
            <div className={styles.uploadBox}>
              <Image
                src="/icons/upload.svg"
                alt="Subir"
                width={48}
                height={48}
              />
              <input
                type="file"
                multiple
                id="fileInput"
                onChange={handleFileChange}
                className={styles.hiddenInput}
                accept="image/jpeg, image/png, image/webp"
              />
              <label htmlFor="fileInput" className={styles.uploadButton}>
                Agregar fotos
              </label>
            </div>
          )}

          <div className={styles.fileList}>
            <p>• Máximo 5 archivos (.jpg .png .webp)</p>
            <p
              className={`${styles.counterText} ${
                files.length === 5 ? styles.counterTextFull : ""
              }`}
            >
              {files.length} / 5 fotos seleccionadas
            </p>
          </div>

          {previews.length > 0 && (
            <div className={styles.previewGrid}>
              {previews.map((src, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={src}
                    alt={`Preview ${index}`}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeButton}
                    title="Eliminar foto"
                  >
                    <Image
                      src="/icons/close.svg"
                      alt="Eliminar"
                      width={14}
                      height={14}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={prevStep}
          className={styles.btnSecondary}
          disabled={loading}
        >
          Regresar
        </button>
        <button
          onClick={handleFinalize}
          className={styles.btnPrimary}
          disabled={loading}
        >
          {loading ? "Publicando..." : "Finalizar y Publicar"}
        </button>
      </div>
    </div>
  );
}
