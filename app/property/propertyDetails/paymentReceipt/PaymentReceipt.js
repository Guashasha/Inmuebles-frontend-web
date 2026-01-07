export default function PaymentReceipt({ receipt }) {
    return (
        <div className="popup">
            <h2>{receipt.message}</h2>
            <h3>Recibo de pago</h3>
            <p>Folio: {receipt.ticket.folio}</p>
            <p>Monto: ${receipt.ticket.monto}</p>
            <p>Referencia: {receipt.ticket.referencia}</p>
            <p>Método de pago: {receipt.ticket.tipo} {receipt.ticket.detalle}</p>
        </div>
    );
}