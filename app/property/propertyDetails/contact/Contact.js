import Button from "@components/button/Button";
import "./contact.css";

export default function Contact({ landlord, onButtonClick }) {
  return (
    <div className="popup">
      <h3>Información de Contacto</h3>

      <p className="section-tag">Nombre Completo</p>
      <p>{landlord.nombre || "No disponible"}</p>

      <p className="section-tag">Número telefónico</p>
      <p>{landlord.telefono || "No disponible"}</p>

      <p className="section-tag">Correo electrónico</p>
      <p style={{ wordBreak: "break-all" }}>
        {landlord.correo || "No disponible"}
      </p>

      <Button onClick={onButtonClick} text="Cerrar" />
    </div>
  );
}
