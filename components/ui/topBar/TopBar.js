'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from "@context/UserContext";
import logoImage from '@images/logo.png';
import userIcon from '@icons/user.svg';
import "./TopBar.css";

export default function TopBar() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  let onClickFunction;
  let userLoggedIn;
  let displayName;

  if (isAuthenticated) {
    onClickFunction = () => router.push("/app/profile");
    userLoggedIn = true;
    displayName = user.name;
  } else {
    onClickFunction = () => router.push("/auth/login");
    userLoggedIn = false;
    displayName = "Iniciar sesión";
  }

  return (
    <div className="topBar">
      <Image alt="Logo de empresa" className="logo" src={logoImage} />

      <div className="accountButton" onClick={onClickFunction}>
        <p>{displayName}</p>
        <Image alt="Icono de usuario" className="userIcon" src={userIcon} />
      </div>
    </div>
  );
}
