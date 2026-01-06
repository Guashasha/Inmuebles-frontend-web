"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import ToggleButton from "@components/toggleButton/ToggleButton";
import SearchBar from "@components/searchBar/SearchBar";
import PropertyOverview from "@components/propertyOverview/PropertyOverview";
import { PROPERTY_CATEGORIES } from "@constants";
import {
  getRecomendedProperties,
  searchProperties as searchService,
} from "@services/PropertyService";
import "./page.css";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
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
            const fallbackResponse = await searchService("", null);
            rawData = fallbackResponse.success ? fallbackResponse.data : [];
          }
        } else {
          const response = await searchService("", null);
          rawData = response.success ? response.data : [];
        }

        const mappedProperties = rawData
          .map(mapBackendToFrontend)
          .filter((p) => p.idInmueble);

        setProperties(mappedProperties);
      } catch (error) {
        console.error("Error cargando propiedades:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const categoryId =
        selectedCategories.length > 0 ? selectedCategories[0] : null;
      const response = await searchService(query, categoryId);

      if (response.success && Array.isArray(response.data)) {
        const mappedProperties = response.data
          .map(mapBackendToFrontend)
          .filter((p) => p.idInmueble);
        setProperties(mappedProperties);
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

  function handleCategoryToggle(categoryId, isToggled) {
    setSelectedCategories((prev) => {
      if (isToggled) return [...prev, categoryId];
      return prev.filter((id) => id !== categoryId);
=======
import { useState, useRef } from "react";
import ToggleButton from "@components/toggleButton/ToggleButton.js";
import SearchBar from "@components/searchBar/SearchBar.js";
import PropertyOverview from "@components/propertyOverview/PropertyOverview";
import { PROPERTY_CATEGORIES } from "@constants";
import "./landing.css";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const toggleButtonRefs = useRef({});

  const properties = [
    {
      idInmueble: "1",
      title: "Casa de campo",
      city: "Xalapa",
      price: "$10,000",
      action: "Renta",
    },
    {
      idInmueble: "2",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "3",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "4",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "5",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "6",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "7",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "8",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "9",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
  ];

  function searchProperties(search) {
    alert(selectedCategories);
  }

  function handleCategoryToggle(categoryId, _state) {
    setSelectedCategory(categoryId);

    Object.values(toggleButtonRefs.current).forEach((element) => {
      element.turnOffIfNotValue(categoryId);
>>>>>>> 7299fd6e95364107368ddcd80d56fb99ce15f409
    });
  }

  const mapBackendToFrontend = (p) => {
    if (!p) return {};

    const safeId = p.id || p.idInmueble;

    const precioNum = parseFloat(p.precio) || 0;
    const precioFormateado = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: p.divisa || "MXN",
    }).format(precioNum);

    const imagenUrl =
      p.imagen && p.imagen.url ? p.imagen.url : "/placeholder-house.jpg";

    return {
      idInmueble: safeId,
      title: p.titulo || "Propiedad sin título",
      city: p.ciudad || p.direccion?.ciudad || "Ubicación desconocida",
      price: precioFormateado,
      action: p.tipoOperacion || "Disponible",
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
                isToggled={category.id === selectedCategory}
                exclusive={true}
                onToggle={handleCategoryToggle}
                ref={(element) =>
                  (toggleButtonRefs.current[category.id] = element)
                }
              />
            ))}
          </div>
          <button
            onClick={() => handleSearch("")}
            className="btnFilter"
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Aplicar Filtros
          </button>
        </div>

        <p className="componentTitle">Propiedades que te podrían gustar</p>

        {loading ? (
          <div
            className="loadingContainer"
            style={{ textAlign: "center", padding: "20px" }}
          >
            Cargando propiedades...
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
              <div
                style={{ width: "100%", textAlign: "center", color: "#666" }}
              >
                <p>No se encontraron propiedades disponibles.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
