"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthService from "@services/AuthService";
import { LOCATIONS, PROPERTY_CATEGORIES } from "@constants";
import Alert from "@components/alert/Alert";
import { validateRegisterData } from "@validators";
import styles from "./register.module.css";

const EyeIcon = ({ visible, onClick, label }) => (
  <button
    type="button"
    className={styles.eyeButton}
    onClick={onClick}
    aria-label={label}
  >
    <Image
      src={visible ? "/icons/eye.svg" : "/icons/eye-off.svg"}
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
    />
  </button>
);

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (e) e.preventDefault();
    setAlert({ type: "", message: "" });
    const { isValid, errors } = validateRegisterData(formData);

    if (!isValid) {
      const firstErrorMessage = Object.values(errors)[0];
      setAlert({ type: "error", message: firstErrorMessage });
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
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
        presupuestoMin:
          formData.presupuestoMin !== "" ? Number(formData.presupuestoMin) : 0,
        presupuestoMax: formData.presupuestoMax
          ? parseFloat(formData.presupuestoMax)
          : 100000000,
        idCategoria: parseInt(formData.idCategoria),
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
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>
          Ingresa tus datos para crear una cuenta
        </p>
      </div>

      <form onSubmit={handleNextStep} className={styles.form}>
        <div className={styles.alertContainer} aria-live="polite">
          {step === 1 && alert.message && (
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
              <label htmlFor="reg-nombre">Nombre(s)</label>
              <input
                id="reg-nombre"
                type="text"
                name="nombre"
                placeholder="Ej. Juan"
                value={formData.nombre}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-apellidos">Apellidos</label>
              <input
                id="reg-apellidos"
                type="text"
                name="apellidos"
                placeholder="Ej. Pérez"
                value={formData.apellidos}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-email">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-telefono">Teléfono</label>
              <input
                id="reg-telefono"
                type="tel"
                name="telefono"
                placeholder="10 dígitos"
                value={formData.telefono}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-fecha">Fecha de nacimiento</label>
              <input
                id="reg-fecha"
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                autoComplete="bday"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-rfc">RFC</label>
              <input
                id="reg-rfc"
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleChange}
                placeholder="Ej. PEJJ800101XXX"
                autoComplete="off"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-estado">Estado</label>
              <select
                id="reg-estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={styles.fullWidthSelect}
                autoComplete="address-level1"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.estado} value={loc.estado}>
                    {loc.estado}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-ciudad">Ciudad</label>
              <select
                id="reg-ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={styles.fullWidthSelect}
                autoComplete="address-level2"
              >
                {availableCities.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>
                    {ciudad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* COLUMNA DERECHA: SEGURIDAD */}
          <div className={styles.column}>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-password">Contraseña</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="****************"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.inputWithIcon}
                  autoComplete="new-password"
                  required
                />
                <EyeIcon
                  visible={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-confirm">Confirmar contraseña</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="reg-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="****************"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={styles.inputWithIcon}
                  autoComplete="new-password"
                  required
                />
                <EyeIcon
                  visible={showConfirmPassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                />
              </div>
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
            Continuar
          </button>
          <Link href="/auth/login" className={styles.link}>
            ¿Ya tienes una cuenta? Iniciar sesión
          </Link>
        </div>
      </form>
    </main>
  );

  const renderStepTwo = () => (
    <main className={styles.preferencesContainer}>
      <h1 className={styles.prefTitle}>¡Un último paso!</h1>
      <p className={styles.prefSubtitle}>
        Establece tus preferencias para recibir recomendaciones personalizadas
      </p>

      <div
        className={styles.alertContainer}
        style={{ maxWidth: "500px" }}
        aria-live="polite"
      >
        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        )}
      </div>

      <form className={styles.prefContent} onSubmit={handleFinalSubmit}>
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
              aria-label="Presupuesto mínimo"
            />
            <span className={styles.dash} aria-hidden="true">
              -
            </span>
            <input
              type="number"
              name="presupuestoMax"
              placeholder="Max"
              className={styles.cleanInput}
              value={formData.presupuestoMax}
              onChange={handleChange}
              aria-label="Presupuesto máximo"
            />
          </div>
          <p className={styles.helperText}>Rango de precios estimado</p>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="pref-categoria" className={styles.labelTitle}>
            Categoría
          </label>
          <select
            id="pref-categoria"
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
            type="submit"
            className={styles.blackButton}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Aceptar y crear cuenta"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className={styles.backButton}
            disabled={loading}
          >
            Regresar
          </button>
        </div>
      </form>
    </main>
  );

  return step === 1 ? renderStepOne() : renderStepTwo();
}
