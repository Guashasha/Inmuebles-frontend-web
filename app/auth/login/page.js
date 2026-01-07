"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthService from "@services/AuthService";
import Alert from "@components/alert/Alert";
import logoImage from "@images/logo.svg";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AuthService.logout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setLoading(true);

    try {
      const result = await AuthService.login(email, password);

      if (result.success) {
        setAlert({ type: "success", message: "Inicio de sesión exitoso" });
        setTimeout(() => router.push("/landing"), 1000);
      } else {
        setAlert({ type: "error", message: result.error });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Error al conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.logoContainer}>
        <Image
          src={logoImage}
          alt="Logo Inmuebles a tu alcance"
          width={120}
          height={120}
          priority
        />
      </div>

      <h1 className={styles.title}>Bienvenido de nuevo</h1>

      <p className={styles.subtitle}>
        Ingresa tus credenciales para acceder <br /> a tu cuenta.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.alertContainer}>
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              className={styles.inputWithIcon}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <Image
                src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <div className={styles.links}>
          <Link href="/auth/register" className={styles.link}>
            ¿No tienes cuenta? <br />
            <strong>Regístrate aquí</strong>
          </Link>
          <Link href="/auth/recovery" className={styles.link}>
            ¿Olvidaste tu contraseña? <br />
            <strong>Recuperar</strong>
          </Link>
        </div>
      </form>
    </main>
  );
}
