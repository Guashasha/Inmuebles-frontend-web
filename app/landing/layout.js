import TopBar from "@components/topBar/TopBar.js";
import { UserProvider } from "../../context/UserContext";

export const metadata = {
  title: "Inmuebles a tu alcance",
  description: "Sistema para la materia desarrollo de sistemas web",
};

export default function MainMenuLayout({ children }) {
  return (
      <div>
        <UserProvider>
          <TopBar />

          <main>{children}</main>
        </UserProvider>
      </div>
  );
}
