'use client';

import { useUser } from "@context/UserContext";
import { useRouter } from 'next/navigation';

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
      <img src="/public/images/logo.png" />

      <div className="accountButton" onClick={onClickFunction}>
        <p>{displayName}</p>
        <img src="./assets/icons/user.svg" />
      </div>
    </div>
  );
}
