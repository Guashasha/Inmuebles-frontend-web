"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { getPropertyData } from "@services/PropertyService";
import ImageCarousel from "@carousel/ImageCarousel";
import "./propertyDetails.css";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="map-loading-placeholder">Cargando mapa...</div>
  ),
});

export default function PropertyDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  function returnToMainMenu() {
    router.back();
  }

  const formatPrice = (amount, currency = "MXN") => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getActiveFeatures = (obj) => {
    if (!obj) return [];
    return Object.entries(obj)
      .filter(([key, value]) => value === true && !key.startsWith("id"))
      .map(([key]) =>
        key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      );
  };

  useEffect(() => {
    if (!id) return;
    async function retrieveData() {
      try {
        setLoading(true);
        const response = await getPropertyData(id);
        if (response && response.success) {
          setProperty(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    retrieveData();
  }, [id]);

  if (loading)
    return (
      <div className="details-container status-container">Cargando...</div>
    );

  if (!property)
    return (
      <div className="details-container status-container">
        Propiedad no encontrada
      </div>
    );

  const isVenta = property.Publicacion?.tipoOperacion === "Venta";
  const precio = isVenta
    ? property.Publicacion?.precioVenta
    : property.Publicacion?.precioRentaMensual;
  const tipoOperacionLabel = isVenta ? "Venta" : "Renta";

  const listaAmenidades = getActiveFeatures(property.Amenidades);
  const listaServicios = getActiveFeatures(property.Servicios);

  let imagenesParaCarrusel = [];
  if (property.imagenes && property.imagenes.length > 0) {
    imagenesParaCarrusel = property.imagenes;
  } else if (property.imagen) {
    imagenesParaCarrusel = [property.imagen];
  }

  const lat = parseFloat(property.Geolocalizacion?.latitud || 0);
  const lng = parseFloat(property.Geolocalizacion?.longitud || 0);

  return (
    <div className="details-container">
      <div className="header-nav">
        <button onClick={returnToMainMenu} className="back-btn">
          ← Volver
        </button>
        <h2 style={{ fontWeight: "600", margin: 0 }}>
          Detalles de la Propiedad
        </h2>
      </div>

      <div className="main-content">
        <div className="left-side-content">
          <div className="property-header">
            <h1 className="property-title">{property.titulo}</h1>
            <p className="property-location">
              {property.Direccion?.ciudad}, {property.Direccion?.estado}
            </p>
          </div>

          <ImageCarousel
            images={imagenesParaCarrusel}
            altTitle={property.titulo}
          />

          <div className="tags-container">
            <span className="tag">
              {property.SubtipoInmueble?.CategoriaInmueble?.nombre}
            </span>
            <span className="tag">{property.SubtipoInmueble?.nombre}</span>
          </div>

          <div className="description-section">
            <h3>Descripción</h3>
            <p className="description-text">
              {property.descripcion || "Sin descripción disponible."}
            </p>
          </div>

          <div className="features-grid">
            <div>
              <h4>Amenidades</h4>
              {listaAmenidades.length > 0 ? (
                <ul className="feature-list">
                  {listaAmenidades.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#999" }}>No especificadas</p>
              )}
            </div>
            <div>
              <h4>Servicios</h4>
              {listaServicios.length > 0 ? (
                <ul className="feature-list">
                  {listaServicios.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#999" }}>No especificados</p>
              )}
            </div>
          </div>
        </div>

        <div className="side-bar">
          <div className="sidebar-card">
            <p className="price-label">Precio de {tipoOperacionLabel}</p>
            <h2 className="price-amount">
              {formatPrice(precio, property.Publicacion?.divisa)}
            </h2>
            {!isVenta && <span style={{ color: "#6b7280" }}>/mes</span>}

            <div className="contact-section">
              <p style={{ fontSize: "0.9rem", marginBottom: "15px" }}>
                <strong>Publicado por:</strong> <br />
                Arrendador ID: {property.idArrendador}
              </p>

              <button className="btn-secondary">Contactar arrendador</button>

              <button className="btn-primary">
                {isVenta ? "Comprar" : "Rentar"}
              </button>
            </div>

            <div style={{ marginTop: "25px" }}>
              <h4 style={{ marginBottom: "10px" }}>Ubicación</h4>
              <Popup
                trigger={
                  <div className="map-trigger">
                    <span className="map-trigger-text">
                      Clic para ver Mapa 🗺️
                    </span>
                  </div>
                }
                modal
                nested
                onOpen={() => {
                  setTimeout(() => {
                    window.dispatchEvent(new Event("resize"));
                  }, 100);
                }}
              >
                {(close) => (
                  <div className="modal-map-container">
                    <button className="close-map-btn" onClick={close}>
                      &times;
                    </button>
                    <div className="map-header">
                      <h3>Ubicación</h3>
                    </div>
                    <div className="map-content">
                      <MapPicker lat={lat} lng={lng} onChange={() => {}} />
                    </div>
                  </div>
                )}
              </Popup>

              <button className="btn-secondary btn-view-location">
                Ver ubicación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
