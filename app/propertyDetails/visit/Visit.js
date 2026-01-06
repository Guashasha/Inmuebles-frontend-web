import Button from "@components/button/Button";
import "./visit.css";

export default function Visit({ scheduleVisit, propertyId, close }) {
  return (
    <div className="popup">
      <h3>Programar una visita</h3>
      <input className="control" type="date"></input>
      <div className="buttons-container">
        <Button
          text="Aceptar visita"
          onClick={() => {
            scheduleVisit(propertyId);
            close();
          }}
        />
        <Button
          text="Cancelar"
          onClick={close}
          type="secondary"
        />
      </div>
    </div>
  );
}
