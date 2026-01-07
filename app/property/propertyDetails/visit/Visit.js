"use client";

import { useState } from "react";
import Button from "@components/button/Button";
import Alert from "@components/alert/Alert";
import "./visit.css";

export default function Visit({ scheduleVisit, propertyId, close }) {
  const [date, setDate] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const today = new Date().toISOString().split("T")[0];

  const handleConfirm = () => {
    if (!date) {
      setAlertInfo({
        show: true,
        message: "Por favor selecciona una fecha válida",
        type: "warning",
      });
      return;
    }
    scheduleVisit(propertyId, date);
    close();
  };

  return (
    <div className="popup">
      {alertInfo.show && (
        <div style={{ width: "100%", marginBottom: "1rem" }}>
          <Alert
            type={alertInfo.type}
            message={alertInfo.message}
            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          />
        </div>
      )}

      <h3 style={{ width: "100%", textAlign: "center" }}>
        Programar una visita
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#6b7280",
          marginBottom: "1rem",
          textAlign: "center",
          width: "100%",
        }}
      >
        Selecciona el día que te gustaría conocer la propiedad.
      </p>

      <input
        className="control"
        type="date"
        min={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="buttons-container">
        <Button text="Confirmar" onClick={handleConfirm} />
        <Button text="Cancelar" onClick={close} type="secondary" />
      </div>
    </div>
  );
}
