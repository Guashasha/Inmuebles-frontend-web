import { useState, useEffect } from "react";
import Button from "@components/button/Button";
import { fetchPaymentMethods, payProperty } from "@services/PaymentService";
import Popup from "reactjs-popup";
import PaymentReceipt from "../paymentReceipt/PaymentReceipt";
import { useRouter } from "next/navigation";

export default function BuyOrRent({ close, property }) {
  const router = useRouter();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  function payForProperty() {
    if (!selectedMethod) {
      alert("No se seleccionó un método de pago");
      return;
    }

    const amount =
      property.Publicacion.tipoOperacion === "Venta"
        ? property.Publicacion.precioVenta
        : property.Publicacion.precioRentaMensual;

    const response = payProperty(property.idInmueble, amount, selectedMethod);

    if (!response.success) {
      alert(property.error);
      return;
    }

    setPaymentReceipt(response);
    setReceiptOpen((o) => !o);
  }

  function getPaymentMethods() {
    let response = null;
    try {
      response = fetchPaymentMethods();
    } catch (error) {
      alert("No se pudieron obtener los métodos de pago");
      close();
    }

    if (response) {
      setPaymentMethods(response.data);
    }
  }

  function handlePaymentMethodSelection(value) {
    setSelectedMethod(value);
  }

  function addPaymentMethod() {
    router.push("/propertyDetails/buyOrRent");
  }

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const priceTag =
    property.Publicacion.tipoOperacion === "Venta"
      ? `$${property.Publicacion.precioVenta}`
      : `$${property.Publicacion.precioRentaMensual}/mes`;

  return (
    <div className="popup">
      <h3>Realizar pago de propiedad</h3>
      <p>
        {property.Publicacion.tipoOperacion} - {property.titulo}
      </p>
      <p>Precio:</p>
      <p>{priceTag}</p>
      {paymentMethods ? (
        <>
          <p>Método de pago</p>
          <select
            name="paymentMethod"
            id="paymentMethod"
            onChange={handlePaymentMethodSelection}
          >
            {paymentMethods.map((paymentMethod) => {
              <option value={paymentMethod.idMetodo}>
                {paymentMethod.detalle}
              </option>;
            })}
          </select>
        </>
      ) : (
        <Button onClick={addPaymentMethod} text="Agregar método de pago" />
      )}
      <div className="buttons-container">
        <Button
          text={
            property.Publicacion.tipoOperacion === "Venta"
              ? "Comprar"
              : "Rentar"
          }
          onClick={payForProperty}
        />
        <Popup open={receiptOpen} onClose={() => {setReceiptOpen(false)}} position="right center" modal nested>
          <PaymentReceipt receipt={paymentReceipt} />
        </Popup>
        <Button text="Cerrar" onClick={close} type="secondary" />
      </div>
    </div>
  );
}
