const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PROFILE_ENDPOINT = "/api/accounts";
import AuthService from "./AuthService";

class AccountService {
  async getProfile() {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(`${API_URL}${PROFILE_ENDPOINT}/profile`, {
        method: "GET",
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

  async updateProfile(updates) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`${API_URL}${PROFILE_ENDPOINT}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar");

      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async changePassword(passwords) {
    try {
      const token = AuthService.getToken();
      const response = await fetch(
        `${API_URL}${PROFILE_ENDPOINT}/change-password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwords),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error al cambiar contraseña");

      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AccountService();
