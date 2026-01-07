"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReturnButton from "@components/returnButton/ReturnButton";
import Alert from "@components/alert/Alert";
import PropertyOverview from "@components/propertyOverview/PropertyOverview";
import {
  getMyProperties,
  getVisits,
  togglePropertyStatus,
  updateVisitStatusAction,
} from "@services/PropertyService";
import styles from "./propertiesMenu.module.css";

export default function PropertiesMenuPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("publicaciones");
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [visits, setVisits] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", show: false });

  const formatPrice = (amount, currency = "MXN") => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "publicaciones") {
          const res = await getMyProperties();
          if (res.success) setProperties(res.data);
        } else {
          const res = await getVisits();
          if (res.success) setVisits(res.data);
        }
      } catch (error) {
        setAlert({
          show: true,
          type: "error",
          message: "Error al cargar la información.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await togglePropertyStatus(id);
      if (res.success) {
        setProperties((prev) =>
          prev.map((p) => {
            const pId = p.idInmueble || p.id;
            return pId === id ? { ...p, estadoPublicacion: res.newStatus } : p;
          })
        );
        setAlert({
          show: true,
          type: "success",
          message: `Propiedad ${
            res.newStatus === "Publicada" ? "reactivada" : "pausada"
          } correctamente.`,
        });
      }
    } catch (error) {
      setAlert({ show: true, type: "error", message: error.message });
    }
  };

  const handleVisitAction = async (id, action) => {
    try {
      const res = await updateVisitStatusAction(id, action);
      if (res.success) {
        setVisits((prev) =>
          prev.map((v) =>
            v.idVisita === id
              ? {
                  ...v,
                  estado: action === "cancel" ? "Cancelada" : "Realizada",
                }
              : v
          )
        );
        setAlert({
          show: true,
          type: "success",
          message: `Visita ${
            action === "cancel" ? "cancelada" : "completada"
          } correctamente.`,
        });
      }
    } catch (error) {
      setAlert({ show: true, type: "error", message: error.message });
    }
  };

  const handleReturn = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      {alert.show && (
        <div className={styles.alertWrapper}>
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.backBtnWrapper}>
            <ReturnButton onClick={handleReturn} />
          </div>
          <h1 className={styles.pageTitle}>Menú de arrendador</h1>
        </div>
        <button
          className={styles.publishBtn}
          onClick={() => router.push("/property/propertyCreate")}
        >
          + Publicar nuevo inmueble
        </button>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${
            activeTab === "publicaciones" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("publicaciones")}
        >
          Mis publicaciones
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "visitas" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("visitas")}
        >
          Visitas agendadas
        </button>
      </div>

      <div className={styles.contentArea}>
        {loading ? (
          <div className={styles.loader}>Cargando...</div>
        ) : activeTab === "publicaciones" ? (
          <div className={styles.propertiesGrid}>
            {properties.length === 0 && (
              <p>No tienes propiedades registradas.</p>
            )}

            {properties.map((prop, index) => {
              const safeId = prop.idInmueble || prop.id;
              const imageUrl =
                prop.imagen && prop.imagen.url ? prop.imagen.url : null;

              const overviewData = {
                idInmueble: safeId,
                title: prop.titulo,
                city: prop.ciudad,
                price: formatPrice(prop.precio, prop.divisa),
                action: prop.tipoOperacion,
                image: imageUrl,
              };

              return (
                <div
                  key={safeId || index}
                  className={styles.propertyCardWrapper}
                >
                  {prop.estadoPublicacion === "Pausada" && (
                    <div className={styles.pausedBadge}>Pausada</div>
                  )}

                  <div className={styles.overviewContainer}>
                    <PropertyOverview propertyOverviewData={overviewData} />
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.btnDark}
                      onClick={() =>
                        handleToggleStatus(safeId, prop.estadoPublicacion)
                      }
                    >
                      {prop.estadoPublicacion === "Pausada"
                        ? "Reactivar"
                        : "Pausar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.visitsList}>
            {visits.length === 0 && <p>No hay visitas agendadas.</p>}

            {visits.length > 0 && (
              <div className={styles.visitHeader}>
                <span>Fecha</span>
                <span>Inmueble</span>
                <span>Cliente</span>
                <span>Contacto</span>
                <span>Mensaje</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
            )}

            {visits.map((visit) => (
              <div key={visit.idVisita} className={styles.visitRow}>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Fecha:</span>
                  {new Date(visit.fechaProgramada).toLocaleDateString()} <br />
                  <small className={styles.timeText}>
                    {new Date(visit.fechaProgramada).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Inmueble:</span>
                  <span className={styles.textTruncate}>
                    {visit.Inmueble.titulo}
                  </span>
                </div>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Cliente:</span>
                  {visit.Cliente.Usuario.nombre}{" "}
                  {visit.Cliente.Usuario.apellidos}
                </div>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Contacto:</span>
                  {visit.Cliente.Usuario.telefono}
                </div>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Mensaje:</span>
                  <span className={styles.msg}>Visita programada</span>
                </div>
                <div className={styles.visitCol}>
                  <span className={styles.mobileLabel}>Estado:</span>
                  <span
                    className={`${styles.visitStatus} ${
                      styles[visit.estado.toLowerCase()] || ""
                    }`}
                  >
                    {visit.estado}
                  </span>
                </div>
                <div className={`${styles.visitCol} ${styles.actionsCol}`}>
                  {visit.estado === "Programada" && (
                    <div className={styles.actionButtonsGroup}>
                      <button
                        className={styles.btnSmallOutline}
                        onClick={() =>
                          handleVisitAction(visit.idVisita, "cancel")
                        }
                      >
                        Cancelar
                      </button>
                      <button
                        className={styles.btnSmallOutline}
                        onClick={() =>
                          handleVisitAction(visit.idVisita, "complete")
                        }
                      >
                        Completar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
