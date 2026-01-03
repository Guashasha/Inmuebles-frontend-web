import { UserProvider } from "../context/UserContext";
import "@styles/global.css";

export const metadata = {
  title: "Inmuebles a tu alcance",
  description: "Encuentra las mejores propiedades en Veracruz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
