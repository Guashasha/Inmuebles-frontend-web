"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@context/UserContext";
import Link from "next/link";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login({ email, password });

    if (result.success) {
      router.push("/landing");
    } else {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="loginContainer">
      <h1 className="title">
        Inmuebles
        <br />a tu alcance
      </h1>

      <p className="subtitle">
        Ingresa tu correo y contraseña
        <br />
        para iniciar sesión
      </p>

      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="loginButton">
          Iniciar sesión
        </button>

        <div className="links">
          <Link href="/auth/register" className="link">
            ¿No tienes una cuenta?
            <br />
            Crear cuenta nueva
          </Link>
          <Link href="/auth/recovery" className="link">
            ¿No recuerdas tu contraseña?
            <br />
            Recuperar contraseña
          </Link>
        </div>
      </form>
    </div>
  );
}
