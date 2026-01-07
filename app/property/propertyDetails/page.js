"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {
  getPropertyData,
  contactLandlord,
  scheduleVisitToProperty,
} from "@services/PropertyService";
import ImageCarousel from "@carousel/ImageCarousel";
import Contact from "./contact/Contact";
import Visit from "./visit/Visit";
import "./propertyDetails.css";
import dynamic from "next/dynamic";
import Alert from "@components/alert/Alert";
import ReturnButton from "@components/returnButton/ReturnButton";
import { useUser } from "@context/UserContext";

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
  const { user } = useUser();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);

  const [alertMessage, setAlertMessage] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (alertMessage.show) {
      const timer = setTimeout(() => {
        setAlertMessage((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage.show]);

  function returnToMainMenu() {
    router.back();
  }

  const handleScheduleVisit = async (propertyId, date) => {
    try {
      const response = await scheduleVisitToProperty(propertyId, date);
      if (response && response.message) {
        setAlertMessage({
          show: true,
          message: response.message,
          type: "success",
        });
      }
    } catch (error) {
      setAlertMessage({
        show: true,
        message: "Error al programar la visita: " + error.message,
        type: "error",
      });
    }
  };

  const handleOpenContact = async () => {
    if (landlordInfo) return;

    try {
      setLoadingContact(true);
      const response = await contactLandlord(property.idInmueble);

      if (response && response.data) {
        setLandlordInfo(response.data);
      } else {
        setLandlordInfo({ telefono: "No disponible", correo: "No disponible" });
      }
    } catch (error) {
      console.error("Error al contactar:", error);
      setLandlordInfo({
        telefono: "Error al cargar",
        correo: "Intente más tarde",
      });
    } finally {
      setLoadingContact(false);
    }
  };

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

  const isMyProperty =
    user && property && Number(property.idArrendador) === Number(user.id);

  return (
    <div className="details-container">
      {alertMessage.show && (
        <Alert
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div className="main-content">
        <div className="left-side-content">
          <div className="property-header">
            <div className="title-row">
              <div className="back-btn-wrapper">
                <ReturnButton onClick={returnToMainMenu} />
              </div>
              <h1 className="property-title">{property.titulo}</h1>
            </div>

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
              <p className="publisher-info">
                <strong>Publicado por:</strong> <br />
                {isMyProperty ? (
                  <span style={{ color: "#2563eb", fontWeight: "600" }}>
                    Ti (Es tu propiedad)
                  </span>
                ) : (
                  <span>
                    {property.Arrendador?.Usuario
                      ? `${property.Arrendador.Usuario.nombre} ${property.Arrendador.Usuario.apellidos}`
                      : `Arrendador ID: ${property.idArrendador}`}
                  </span>
                )}
              </p>

              {user && !isMyProperty && (
                <>
                  <Popup
                    trigger={
                      <button className="btn-secondary">
                        Contactar arrendador
                      </button>
                    }
                    modal
                    nested
                    onOpen={handleOpenContact}
                  >
                    {(close) => (
                      <div className="modal-container">
                        {loadingContact ? (
                          <div className="contact-loading">
                            Obteniendo datos...
                          </div>
                        ) : (
                          <Contact
                            landlord={
                              landlordInfo || { telefono: "", correo: "" }
                            }
                            onButtonClick={close}
                          />
                        )}
                      </div>
                    )}
                  </Popup>

                  <Popup
                    trigger={
                      <button className="btn-secondary btn-schedule">
                        Programar visita
                      </button>
                    }
                    modal
                    nested
                  >
                    {(close) => (
                      <Visit
                        propertyId={property.idInmueble}
                        scheduleVisit={handleScheduleVisit}
                        close={close}
                      />
                    )}
                  </Popup>

                  <button className="btn-primary">
                    {isVenta ? "Comprar" : "Rentar"}
                  </button>
                </>
              )}

              {!user && (
                <div className="auth-prompt-container">
                  <p className="auth-prompt-text">
                    ¿Te interesa esta propiedad?
                  </p>
                  <button
                    className="btn-primary btn-auth-action"
                    onClick={() => router.push("/auth/login")}
                  >
                    Inicia Sesión para contactar
                  </button>
                </div>
              )}

              {isMyProperty && (
                <div className="owner-message">
                  Gestiona esta publicación desde tu menú de arrendador.
                </div>
              )}
            </div>

            <div className="map-section-wrapper">
              <h4 className="map-section-title">Ubicación</h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
