"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import styles from "./buyOrRent.module.css";
import Button from "@components/button/Button";
import Alert from "@components/alert/Alert";
import PaymentReceipt from "../paymentReceipt/PaymentReceipt";
import { fetchPaymentMethods, payProperty } from "@services/PaymentService";

export default function BuyOrRent({ close, property }) {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (alertState.show) {
      const timer = setTimeout(() => {
        setAlertState((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertState.show]);

  useEffect(() => {
    async function getMethods() {
      try {
        const response = await fetchPaymentMethods();
        if (response && response.data) {
          setPaymentMethods(response.data);
        }
      } catch (error) {
        console.error("Error cargando métodos", error);
        setAlertState({
          show: true,
          type: "error",
          message: "No se pudieron cargar tus métodos de pago.",
        });
      }
    }
    getMethods();
  }, []);

  async function payForProperty() {
    setAlertState({ show: false, message: "", type: "" });

    if (!selectedMethod) {
      setAlertState({
        show: true,
        type: "error",
        message: "Por favor, selecciona un método de pago.",
      });
      return;
    }

    const amount =
      property.Publicacion.tipoOperacion === "Venta"
        ? property.Publicacion.precioVenta
        : property.Publicacion.precioRentaMensual;

    try {
      const response = await payProperty(
        property.idInmueble,
        amount,
        selectedMethod
      );

      if (!response.success) {
        setAlertState({
          show: true,
          type: "error",
          message: response.error || "Error al procesar el pago.",
        });
        return;
      }

      setPaymentReceipt(response);
      setReceiptOpen(true);
    } catch (error) {
      setAlertState({
        show: true,
        type: "error",
        message: "Ocurrió un error de conexión al intentar pagar.",
      });
    }
  }

  const handleReceiptClose = () => {
    setReceiptOpen(false);
    close();
    router.push("/");
  };

  function handleMethodChange(e) {
    setSelectedMethod(e.target.value);
    if (alertState.show) setAlertState((prev) => ({ ...prev, show: false }));
  }

  return (
    <div className={styles.container}>
      {alertState.show && (
        <div style={{ marginBottom: "15px" }}>
          <Alert
            type={alertState.type}
            message={alertState.message}
            onClose={() => setAlertState((prev) => ({ ...prev, show: false }))}
          />
        </div>
      )}

      <h3 className={styles.title}>Realizar pago de propiedad</h3>

      <div className={styles.infoRow}>
        <span className={styles.label}>Operación:</span>
        <span className={styles.value}>
          {property.Publicacion.tipoOperacion} - {property.titulo}
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.label}>Total a pagar:</span>
        <span className={styles.price}>
          {property.Publicacion.tipoOperacion === "Venta"
            ? `$${property.Publicacion.precioVenta}`
            : `$${property.Publicacion.precioRentaMensual}/mes`}
        </span>
      </div>

      <hr className={styles.divider} />

      {paymentMethods.length > 0 ? (
        <div className={styles.inputGroup}>
          <label htmlFor="pMethod" className={styles.label}>
            Selecciona Método de Pago
          </label>
          <select
            id="pMethod"
            className={styles.control}
            value={selectedMethod}
            onChange={handleMethodChange}
          >
            <option value="" disabled>
              -- Selecciona una opción --
            </option>
            {paymentMethods.map((pm) => (
              <option key={pm.idMetodo} value={pm.idMetodo}>
                {pm.detalle} ({pm.tipo})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No tienes métodos de pago guardados.</p>
          <Button
            onClick={() => router.push("/account/accountDetails")}
            text="Agregar nuevo método"
            type="secondary"
          />
        </div>
      )}

      <div className={styles.actions}>
        <Button text="Cancelar" onClick={close} type="secondary" />
        <Button
          text={
            property.Publicacion.tipoOperacion === "Venta"
              ? "Pagar Compra"
              : "Pagar Renta"
          }
          onClick={payForProperty}
        />
      </div>

      <Popup
        open={receiptOpen}
        onClose={handleReceiptClose}
        modal
        nested
        closeOnDocumentClick={false}
      >
        <PaymentReceipt receipt={paymentReceipt} onClose={handleReceiptClose} />
      </Popup>
    </div>
  );
}
