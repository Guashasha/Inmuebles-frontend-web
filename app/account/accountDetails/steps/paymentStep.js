"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchPaymentMethods,
  saveNewPaymentMethod,
} from "@services/PaymentService";
import { useAccount } from "@context/AccountContext";
import { validatePaymentMethodInfo } from "@validators";
import styles from "../account.module.css";
import Button from "@components/button/Button";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function PaymentStep() {
  const router = useRouter();
  const { setAlert } = useAccount();
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState("paypal");
  const [paymentDetails, setPaymentDetails] = useState("");

  useEffect(() => {
    getPaymentMethods();
  }, []);

  async function getPaymentMethods() {
    try {
      setAlert({ type: "", message: "" });
      const response = await fetchPaymentMethods();

      if (response.success === false) {
        setAlert({
          type: "error",
          message: "Error al cargar métodos: " + response.error,
        });
        return;
      }

      if (response.data) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      console.error("Error al cargar métodos:", error);
      setAlert({ type: "error", message: "Ocurrió un error inesperado." });
    }
  }

  function addNewPaymentMethod() {
    setPaymentDetails("");
    setSelectedPaymentType("paypal");
    setAlert({ type: "", message: "" });
    setAddMethodOpen(true);
  }

  function handlePaymentMethodSelection(e) {
    setSelectedPaymentType(e.target.value);
    setPaymentDetails("");
    setAlert({ type: "", message: "" });
  }

  function handleInputChange(e) {
    setPaymentDetails(e.target.value);
    setAlert({ type: "", message: "" });
  }

  async function savePaymentMethod(e) {
    if (e) e.preventDefault();

    setAlert({ type: "", message: "" });

    const { isValid, error } = validatePaymentMethodInfo(
      selectedPaymentType,
      paymentDetails
    );

    if (!isValid) {
      setAlert({ type: "error", message: error });
      return;
    }

    const response = await saveNewPaymentMethod(
      selectedPaymentType,
      paymentDetails
    );

    if (response.success === false) {
      setAlert({
        type: "error",
        message: response.error || "No se pudo guardar el método de pago.",
      });
    } else {
      setAlert({
        type: "success",
        message: "Método de pago agregado correctamente.",
      });
      setAddMethodOpen(false);
      getPaymentMethods();
    }
  }

  return (
    <div>
      <div className={styles.paymentTitle}>
        <h3>Métodos de pago agregados</h3>
        <Button
          text="+"
          onClick={addNewPaymentMethod}
          type="secondary"
          aria-label="Agregar nuevo método de pago"
        />
      </div>

      <div className={styles.methodsContainer}>
        {paymentMethods && paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div className={styles.paymentMethod} key={method.idMetodo}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                  {method.tipo}{" "}
                  {method.predeterminado && (
                    <span aria-label="Método predeterminado">⭐</span>
                  )}
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  {method.detalle}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            No tienes métodos guardados. Agrega uno con el botón "+".
          </p>
        )}
      </div>

      <Popup
        open={addMethodOpen}
        onClose={() => {
          setAddMethodOpen(false);
          setAlert({ type: "", message: "" });
        }}
        modal
        nested
        contentStyle={{
          padding: "20px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "450px",
        }}
      >
        <form className={styles.modalContent} onSubmit={savePaymentMethod}>
          <h3 style={{ marginBottom: "1rem" }}>Agregar nueva forma de pago</h3>

          <label
            htmlFor="payment-type"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Tipo de método:
          </label>
          <select
            id="payment-type"
            className={styles.control}
            style={{ marginBottom: "1rem" }}
            value={selectedPaymentType}
            onChange={handlePaymentMethodSelection}
          >
            <option value="paypal">PayPal</option>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="mercadopago">MercadoPago</option>
          </select>

          <label
            htmlFor="payment-details"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            {selectedPaymentType === "tarjeta"
              ? "Número de tarjeta"
              : "Correo electrónico"}
          </label>

          <input
            id="payment-details"
            className={styles.control}
            style={{ marginBottom: "1.5rem" }}
            type={selectedPaymentType === "tarjeta" ? "text" : "email"}
            inputMode={selectedPaymentType === "tarjeta" ? "numeric" : "email"}
            value={paymentDetails}
            onChange={handleInputChange}
            placeholder={
              selectedPaymentType === "tarjeta"
                ? "0000 0000 0000 0000"
                : "ejemplo@correo.com"
            }
            maxLength={selectedPaymentType === "tarjeta" ? 19 : 100}
            autoComplete="off"
          />

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button
              text="Cancelar"
              onClick={() => {
                setAddMethodOpen(false);
                setAlert({ type: "", message: "" });
              }}
              type="button"
              className="btnSecondary"
            />
            <Button text="Guardar" onClick={savePaymentMethod} type="submit" />
          </div>
        </form>
      </Popup>
    </div>
  );
}
