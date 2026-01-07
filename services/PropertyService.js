const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PROPERTY_ENDPOINT = "/api/properties";
const INTERACTIONS_ENDPOINT = "/api/interactions";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export async function getPropertyData(id) {
  const url = `${API_URL}${PROPERTY_ENDPOINT}/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al cargar la propiedad");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en getPropertyData:", error);
    throw error;
  }
}

export async function getPropertyImages(id) {
  const url = `${API_URL}${PROPERTY_ENDPOINT}/${id}/images`;
  try {
    const response = await fetch(url);
    if (!response.ok) return { success: false, data: [] };
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getRecomendedProperties(page = 1) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const url = `${API_URL}${PROPERTY_ENDPOINT}/recommended?page=${page}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error("Error al obtener recomendados");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function searchProperties(query, categoryId, page = 1) {
  const catParam = categoryId ? `&idCategoria=${categoryId}` : "";
  const queryParam = query ? `&titulo=${query}` : "";

  const url = `${API_URL}${PROPERTY_ENDPOINT}?page=${page}${queryParam}${catParam}`;

  const response = await fetch(url);
  return await response.json();
}

export async function createProperty(propertyData) {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const url = `${API_URL}${PROPERTY_ENDPOINT}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Error al crear la propiedad"
    );
  }

  return data;
}

export async function uploadPropertyImages(propertyId, files) {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const url = `${API_URL}${PROPERTY_ENDPOINT}/${propertyId}/images`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al subir imágenes");
  }

  return await response.json();
}

export async function contactLandlord(propertyId) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const url = `${API_URL}${INTERACTIONS_ENDPOINT}/properties/${propertyId}/contact`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error contactLandlord:", {
        status: response.status,
        msg: errorData,
      });
      throw new Error(errorData.message || "Error al contactar al arrendador");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "No se pudo obtener la información de contacto.",
    };
  }
}

export async function scheduleVisitToProperty(propertyId, date) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const url = `${API_URL}${INTERACTIONS_ENDPOINT}/properties/${propertyId}/visit`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ date: date }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Error al agendar visita");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
}

export async function togglePropertyStatus(propertyId) {
  const token = getToken();
  if (!token) throw new Error("No estás autenticado");

  const url = `${API_URL}${PROPERTY_ENDPOINT}/${propertyId}/status`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al cambiar el estado de la publicación"
      );
    }

    return data;
  } catch (error) {
    console.error("Error en togglePropertyStatus:", error);
    throw error;
  }
}

export async function updateVisitStatusAction(visitId, action) {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_URL}${INTERACTIONS_ENDPOINT}/visits/${visitId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Error al actualizar visita");

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMyProperties() {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(
      `${API_URL}${PROPERTY_ENDPOINT}/my-properties`,
      { headers }
    );
    if (!response.ok) throw new Error("Error al cargar mis propiedades");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getVisits() {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(`${API_URL}${INTERACTIONS_ENDPOINT}/visits`, {
      headers,
    });
    if (!response.ok) throw new Error("Error al cargar visitas");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}
