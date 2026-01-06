const PAYMENT_METHODS_ENDPOINT = "/methods";
const PAYMENT_ENDPOINT = "/pay";
import AuthService from "./AuthService";

export async function fetchPaymentMethods() {
  try {
    const token = AuthService.getToken();
    const response = await fetch(`${API_URL}${PAYMENT_METHODS_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Error al obtener perfil");

    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function payProperty(propertyId, amount, methodId) {
  try {
    const response = await fetch(`${API_URL}${PAYMENT_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: {
        propertyId: propertyId,
        amount: amount,
        methodId: methodId,
      },
    });

    if (!response) return { success: false, error: error.message };

    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}
