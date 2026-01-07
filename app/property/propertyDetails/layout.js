import TopBar from "@components/topBar/TopBar.js";
import { Suspense } from "react";

export const metadata = {
  title: "Inmuebles a tu alcance",
  description: "Sistema para la materia desarrollo de sistemas web",
};

export default function MainMenuLayout({ children }) {
  return (
    <div>
      <TopBar />
      <main>
        <Suspense
          fallback={
            <div style={{ padding: "50px", textAlign: "center" }}>
              Cargando detalles...
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
