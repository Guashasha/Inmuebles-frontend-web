"use client";

import { useState, useEffect } from "react";
import ToggleButton from "@components/toggleButton/ToggleButton";
import SearchBar from "@components/searchBar/SearchBar";
import PropertyOverview from "@components/propertyOverview/PropertyOverview";
import { PROPERTY_CATEGORIES } from "@constants";
import {
  getRecomendedProperties,
  searchProperties as searchService,
} from "@services/PropertyService";
import "./landing.css";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDefaultProperties = async () => {
    setLoading(true);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    let rawData = [];

    try {
      if (token) {
        const response = await getRecomendedProperties();
        if (response.success && Array.isArray(response.data)) {
          rawData = response.data;
        } else {
          const fallback = await searchService("", null);
          rawData = fallback.success ? fallback.data : [];
        }
      } else {
        const response = await searchService("", null);
        rawData = response.success ? response.data : [];
      }

      setProperties(processProperties(rawData));
    } catch (error) {
      console.error("Error cargando propiedades:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultProperties();
  }, []);

  const fetchProperties = async (query, categoryId) => {
    setLoading(true);
    try {
      const response = await searchService(query, categoryId);

      if (response.success && Array.isArray(response.data)) {
        setProperties(processProperties(response.data));
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error(error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const currentCategoryId =
      selectedCategories.length > 0 ? selectedCategories[0] : null;
    fetchProperties(query, currentCategoryId);
  };

  function handleCategoryToggle(categoryId) {
    const id = String(categoryId);
    let newCategories = [];

    const isAlreadySelected = selectedCategories.includes(id);

    if (isAlreadySelected) {
      newCategories = [];
    } else {
      newCategories = [id];
    }

    setSelectedCategories(newCategories);

    const categoryToSend = newCategories.length > 0 ? newCategories[0] : null;
    fetchProperties(searchQuery, categoryToSend);
  }

  const processProperties = (data) => {
    return data.map(mapBackendToFrontend).filter((p) => p.idInmueble);
  };

  const mapBackendToFrontend = (p) => {
    if (!p) return {};
    const safeId = p.id || p.idInmueble;
    const precioNum = parseFloat(p.precio) || 0;
    const divisa = p.divisa || p.Publicacion?.divisa || "MXN";

    const precioFormateado = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: divisa,
      minimumFractionDigits: 0,
    }).format(precioNum);

    const imagenUrl =
      p.imagen && p.imagen.url ? p.imagen.url : "/placeholder-house.jpg";

    return {
      idInmueble: safeId,
      title: p.titulo || "Propiedad sin título",
      city:
        p.ciudad ||
        p.direccion?.ciudad ||
        p.Direccion?.ciudad ||
        "Ubicación desconocida",
      price: precioFormateado,
      action: p.tipoOperacion || p.Publicacion?.tipoOperacion || "Disponible",
      image: imagenUrl,
      beds: p.detallesFisicos?.numRecamaras || 0,
      baths: p.detallesFisicos?.numBaños || 0,
      sqm: p.detallesFisicos?.superficieTotal || 0,
    };
  };

  return (
    <div>
      <div className="mainContainer">
        <div className="searchControls">
          <p className="componentTitle">Buscar propiedades</p>

          <SearchBar onSearch={handleSearch} />

          <div className="categoriesContainer">
            <p>Categoría:</p>
            {PROPERTY_CATEGORIES.map((category) => (
              <ToggleButton
                key={category.id}
                label={category.label}
                value={category.id}
                isToggled={selectedCategories.includes(String(category.id))}
                onToggle={handleCategoryToggle}
              />
            ))}
          </div>
        </div>

        <p className="componentTitle">
          {searchQuery || selectedCategories.length > 0
            ? "Resultados de búsqueda"
            : "Propiedades que te podrían gustar"}
        </p>

        {loading ? (
          <div
            className="loadingContainer"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <p>Cargando propiedades...</p>
          </div>
        ) : (
          <div className="propertiesGrid">
            {properties.map((property) => (
              <PropertyOverview
                key={property.idInmueble}
                propertyOverviewData={property}
              />
            ))}

            {properties.length === 0 && (
              <div className="noResultsContainer">
                <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                  No se encontraron propiedades con estos filtros.
                </p>
                <button
                  className="clearFiltersBtn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    loadDefaultProperties();
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
