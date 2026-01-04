import TopBar from "@components/topBar/TopBar.js";

export const metadata = {
  title: "Inmuebles a tu alcance",
  description: "Sistema para la materia desarrollo de sistemas web",
};

export default function MainMenuLayout({ children }) {
  return (
    <div>
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
