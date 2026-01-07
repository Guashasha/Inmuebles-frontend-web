"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPaymentMethods, saveNewPaymentMethod } from "@services/PaymentService";
import styles from "../account.module.css";
import Button from "@components/button/Button";
import Popup from "reactjs-popup";

export default function PersonalStep() {
  const router = useRouter();
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState("paypal");
  const [paymentDetails, setPaymentDetails] = useState("");

  useEffect(() => {
    getPaymentMethods();
  }, []);

  function getPaymentMethods() {
    const response = fetchPaymentMethods();
    if (!response.success) {
      alert(
        "Ocurrió un error al recuperar los métodos de pago, intente de nuevo."
      );
      return;
    }

    setPaymentMethods(response.data);
  }

  function addNewPaymentMethod() {
    setAddMethodOpen(true);
  }

  function handlePaymentMethodSelection(value) {
    setSelectedPaymentType(value);
  }

  function handleInputChange(value) {
    setPaymentDetails(value.target.value);
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateCard(card) {
    const cardRegex = /^\d{16}$/;
    return cardRegex.test(card);
  }

  function savePaymentMethod() {
    if (!selectedPaymentType) return;
    if (paymentDetails === "") {
      alert("Ingresa los detalles del método de pago");
      return;
    }

    switch (selectedPaymentType) {
      case "paypal":
      case "mercadopago":
        if (!validateEmail(paymentDetails)) alert("Ingrese un correo válido");
        return;
      case "tarjeta":
        if (!validateCard(paymentDetails)) alert("Ingrese un número de tarjeta válido");
        return;
    }

    saveNewPaymentMethod(selectedPaymentType, paymentDetails);
  }

  function AddMethodForm() {
    return (
      <div>
        <h3>Agregar nueva forma de pago</h3>
        <label>Tipo</label>
        <select onChange={(e) => handlePaymentMethodSelection(e)}>
          <option value="paypal" selected>
            Paypal
          </option>
          <option value="tarjeta">Tarjeta</option>
          <option value="mercadopago">mercadopago</option>
        </select>
        <label>
          {selectedPaymentType === "paypal" ||
          selectedPaymentType === "mercadopago"
            ? "Correo electrónico"
            : "Número de tarjeta"}
        </label>
        <input type="text" onChange={(e) => handleInputChange(e)} />
        <Button text="Guardar" onClick={savePaymentMethod} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.paymentTitle}>
        <h3>Métodos de pago agregados</h3>
        <Button text="+" onClick={addNewPaymentMethod} type="secondary" />
      </div>

      {paymentMethods ? (
        paymentMethods.map((method) => {
          <div className={styles.paymentMethod}>
            <p>{method.tipo}</p>
            <p>{method.detalle}</p>
          </div>;
        })
      ) : (
        <p>Agrega un método de pago con el botón "+"</p>
      )}

      <Popup
        open={addMethodOpen}
        onClose={() => {
          setAddMethodOpen(false);
        }}
        position="right center"
        modal
        nested
      >
        <AddMethodForm />
      </Popup>
    </div>
  );
}
