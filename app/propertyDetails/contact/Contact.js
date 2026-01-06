import Button from "@components/button/Button";
import "./contact.css";

export default function Contact({ landlord, onButtonClick }) {
  return <div className="popup">
    <h3>Información del contacto del publicante</h3>
    <p className="section-tag">Número telefónico</p>
    <p>{landlord.telefono}</p>
    <p className="section-tag">Correo electrónico</p>
    <p>{landlord.correo}</p>
    <Button onClick={onButtonClick} text="Cerrar"></Button>
  </div>;
}
