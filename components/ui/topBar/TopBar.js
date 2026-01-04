"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@context/UserContext";
import logoImage from "@images/logo.png";
import userIcon from "@icons/user.svg";
import "./TopBar.css";

export default function TopBar() {
  const { user, isAuthenticated, loadingUser } = useUser();
  const router = useRouter();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push("/app/profile");
    } else {
      router.push("/auth/login");
    }
  };

  if (loadingUser) {
    return <div className="topBar">Cargando...</div>;
  }

  return (
    <div className="topBar">
      <Image alt="Logo de empresa" className="logo" src={logoImage} priority />

      <div
        className={`accountButton ${isAuthenticated ? "active" : ""}`}
        onClick={handleAccountClick}
        role="button"
        tabIndex={0}
      >
        <p>{isAuthenticated && user ? user.nombre : "Iniciar sesión"}</p>

        <Image alt="Icono de usuario" className="userIcon" src={userIcon} />
      </div>
    </div>
  );
}
