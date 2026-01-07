import AuthService from "./AuthService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PAYMENT_METHODS_ENDPOINT = "/api/payments/methods";
const PAYMENT_ENDPOINT = "/api/payments/pay";

export async function fetchPaymentMethods() {
  try {
    const token = AuthService.getToken();

    if (!API_URL) {
      console.error("API_URL no está definida en las variables de entorno");
      return { success: false, error: "Error de configuración del servidor" };
    }

    const response = await fetch(`${API_URL}${PAYMENT_METHODS_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Error al obtener métodos de pago");

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, error: error.message };
  }
}

export async function payProperty(propertyId, amount, methodId) {
  try {
    const token = AuthService.getToken();
    const response = await fetch(`${API_URL}${PAYMENT_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idInmueble: propertyId,
        monto: amount,
        idMetodo: methodId,
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || data.message || "Error en el pago");

    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function saveNewPaymentMethod(paymentType, paymentDetails) {
  try {
    const token = AuthService.getToken();
    const response = await fetch(`${API_URL}${PAYMENT_METHODS_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: paymentType,
        datos: paymentDetails,
        predeterminado: false,
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Error al guardar método");

    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
