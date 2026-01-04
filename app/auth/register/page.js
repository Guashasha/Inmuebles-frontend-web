"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthService from "@/services/AuthService";
import { LOCATIONS, PROPERTY_CATEGORIES } from "@constants";
import Alert from "@components/alert/Alert";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    rfc: "",
    estado: LOCATIONS[0].estado,
    ciudad: LOCATIONS[0].ciudades[0],
    password: "",
    confirmPassword: "",
    fechaNacimiento: "2000-01-01",
    calle: "Sin especificar (Registro rápido)",
    noCalle: "0",
    colonia: "Sin especificar",
    codigoPostal: "00000",
    rol: "Cliente",
    nacionalidad: "Mexicana",
    presupuestoMin: "",
    presupuestoMax: "",
    idCategoria: PROPERTY_CATEGORIES[0].id,
  });

  const availableCities = useMemo(() => {
    const selectedLocation = LOCATIONS.find(
      (loc) => loc.estado === formData.estado
    );
    return selectedLocation ? selectedLocation.ciudades : [];
  }, [formData.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "estado") {
      const locationObj = LOCATIONS.find((loc) => loc.estado === value);
      setFormData((prev) => ({
        ...prev,
        estado: value,
        ciudad: locationObj ? locationObj.ciudades[0] : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "error", message: "Las contraseñas no coinciden." });
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setAlert({ type: "", message: "" });
    try {
      const payload = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        nacionalidad: formData.nacionalidad,
        direccion: {
          calle: formData.calle,
          noCalle: formData.noCalle,
          colonia: formData.colonia,
          ciudad: formData.ciudad,
          estado: formData.estado,
          codigoPostal: formData.codigoPostal,
        },
        rfc: formData.rfc,
        presupuestoMin: formData.presupuestoMin,
        presupuestoMax: formData.presupuestoMax,
        idCategoria: formData.idCategoria,
      };

      const result = await AuthService.register(payload);

      if (result.success) {
        router.push("/auth/login");
      } else {
        setAlert({ type: "error", message: result.error });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: "Error de conexión con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepOne = () => (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Ingresa tus datos para crear una cuenta
        </p>
      </div>

      <form onSubmit={handleNextStep} className={styles.form}>
        <div className={styles.alertContainer}>
          {step === 1 && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ type: "", message: "" })}
            />
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.column}>
            <div className={styles.inputGroup}>
              <label>Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                placeholder="Ej. Pérez"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="10 dígitos"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>RFC</label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleChange}
                required
                placeholder="Obligatorio"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={styles.fullWidthSelect}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.estado} value={loc.estado}>
                    {loc.estado}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Ciudad</label>
              <select
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={styles.fullWidthSelect}
              >
                {availableCities.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.inputGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="****************"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="****************"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

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

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Crear cuenta
          </button>
          <Link href="/auth/login" className={styles.link}>
            ¿Ya tienes una cuenta? Iniciar sesión
          </Link>
        </div>
      </form>
    </div>
  );

  const renderStepTwo = () => (
    <div className={styles.preferencesContainer}>
      <h1 className={styles.prefTitle}>¡Un último paso!</h1>
      <p className={styles.prefSubtitle}>
        Establece tus preferencias para recibir recomendaciones personalizadas
      </p>

      {/* REEMPLAZO: Componente Alert */}
      <div className={styles.alertContainer} style={{ maxWidth: "500px" }}>
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      </div>

      <div className={styles.prefContent}>
        <div className={styles.sliderSection}>
          <div className={styles.labelRow}>
            <span className={styles.labelTitle}>Presupuesto</span>
            <span className={styles.labelValue}>
              ${formData.presupuestoMin || 0} - $
              {formData.presupuestoMax || "Sin límite"}
            </span>
          </div>
          <div className={styles.inputsRow}>
            <input
              type="number"
              name="presupuestoMin"
              placeholder="Min"
              className={styles.cleanInput}
              value={formData.presupuestoMin}
              onChange={handleChange}
            />
            <span className={styles.dash}>-</span>
            <input
              type="number"
              name="presupuestoMax"
              placeholder="Max"
              className={styles.cleanInput}
              value={formData.presupuestoMax}
              onChange={handleChange}
            />
          </div>
          <p className={styles.helperText}>Rango de precios estimado</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.labelTitle}>Categoría</label>
          <select
            name="idCategoria"
            className={styles.cleanSelect}
            value={formData.idCategoria}
            onChange={handleChange}
          >
            {PROPERTY_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.prefActions}>
          <button
            onClick={handleFinalSubmit}
            className={styles.blackButton}
            disabled={loading}
          >
            {loading ? "Finalizando..." : "Aceptar preferencias"}
          </button>
        </div>
      </div>
    </div>
  );

  return step === 1 ? renderStepOne() : renderStepTwo();
}
