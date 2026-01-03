import "@styles/global.css";

import TopBar from "@components/topBar/TopBar.js";
import { UserProvider } from "../../context/UserContext";

export const metadata = {
  title: "Inmuebles a tu alcance",
  description: "Sistema para la materia desarrollo de sistemas web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <UserProvider>
          <TopBar
          />

          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
