const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_ENDPOINT = "/api/auth";

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}${AUTH_ENDPOINT}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}${AUTH_ENDPOINT}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async requestPasswordReset(email) {
    try {
      const response = await fetch(
        `${API_URL}${AUTH_ENDPOINT}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al solicitar recuperación");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(
        `${API_URL}${AUTH_ENDPOINT}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
