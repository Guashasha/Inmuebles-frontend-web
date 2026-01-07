import "./paymentReceipt.css";

export default function PaymentReceipt({ receipt, onClose }) {
  return (
    <div className="receipt-container">
      <div style={{ fontSize: "3rem", marginBottom: "10px" }}></div>

      <h2>{receipt.message}</h2>
      <h3>Recibo de pago</h3>
      <div className="receipt-details">
        <p>
          <span>Folio:</span>
          <strong>{receipt.ticket.folio}</strong>
        </p>
        <p>
          <span>Monto:</span>
          <strong style={{ fontSize: "1.1em" }}>${receipt.ticket.monto}</strong>
        </p>
        <p>
          <span>Referencia:</span>
          <span>{receipt.ticket.referencia}</span>
        </p>
        <p style={{ display: "block", textAlign: "left" }}>
          <span
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            Método de pago:
          </span>
          <strong>
            {receipt.ticket.tipo} - {receipt.ticket.detalle}
          </strong>
        </p>
      </div>

      <button onClick={onClose}>Finalizar y Salir</button>
    </div>
  );
}
