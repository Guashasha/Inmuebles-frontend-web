"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useUser } from "@context/UserContext";
import logoImage from "@images/logo.svg";
import "./TopBar.css";

export default function TopBar() {
  const { user, isAuthenticated, logout, loadingUser } = useUser();
  const router = useRouter();

  const handleMenuClick = (action, close) => {
    close();
    switch (action) {
      case "account":
        router.push("/account/accountDetails");
        break;
      case "publications":
        router.push("/property/propertiesMenu");
        break;
      case "logout":
        logout();
        router.push("/");
        break;
      default:
        break;
    }
  };

  const MenuContent = ({ close }) => (
    <div className="account-menu">
      <button
        className="menu-item"
        onClick={() => handleMenuClick("account", close)}
      >
        Mi cuenta
      </button>
      <button
        className="menu-item"
        onClick={() => handleMenuClick("publications", close)}
      >
        Mis publicaciones/Visitas
      </button>
      <div className="menu-divider"></div>
      <button
        className="menu-item logout"
        onClick={() => handleMenuClick("logout", close)}
      >
        Cerrar sesión
      </button>
    </div>
  );

  const AccountButton = ({ onClick, ...props }) => (
    <div
      className={`accountButton ${isAuthenticated ? "active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={
        isAuthenticated ? `Cuenta de ${user?.nombre}` : "Iniciar sesión"
      }
      {...props}
    >
      <p>{isAuthenticated && user ? user.nombre : "Ingresar"}</p>
    </div>
  );

  return (
    <nav className="topBar">
      <div className="layout-spacer" />
      <div className="logoContainer">
        <Image
          alt="Inmuebles a tu alcance"
          className="logo"
          src={logoImage}
          priority
          onClick={() => router.push("/")}
        />
      </div>

      <div className="layout-right">
        {loadingUser ? (
          <div className="loader">...</div>
        ) : isAuthenticated ? (
          <Popup
            trigger={
              <div>
                <AccountButton />
              </div>
            }
            position="bottom right"
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            offsetY={10}
            contentStyle={{
              padding: "0px",
              border: "none",
              borderRadius: "12px",
              width: "220px",
              zIndex: "9999",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
            arrow={false}
          >
            {(close) => <MenuContent close={close} />}
          </Popup>
        ) : (
          <AccountButton onClick={() => router.push("/auth/login")} />
        )}
      </div>
    </nav>
  );
}
