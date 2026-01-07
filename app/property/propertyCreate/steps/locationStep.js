"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePropertyCreation } from "@context/PropertyContext";
import { LOCATIONS } from "@constants";
import { validatePropertyLocation } from "@validators";
import Alert from "@components/alert/Alert";
import styles from "../property.module.css";

const MapPicker = dynamic(() => import("@map/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder}>
      <p>Cargando mapa...</p>
    </div>
  ),
});

export default function LocationStep() {
  const { propertyData, updatePropertyData, nextStep, prevStep } =
    usePropertyCreation();

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const updateMapLocation = async (city, state) => {
    if (!city || !state) return;

    try {
      const query = `${city}, ${state}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        updatePropertyData("geolocalizacion", "latitud", parseFloat(lat));
        updatePropertyData("geolocalizacion", "longitud", parseFloat(lon));

        if (errors.mapa) setErrors((prev) => ({ ...prev, mapa: null }));
      }
    } catch (error) {
      console.error("Error al actualizar el mapa:", error);
    }
  };

  const validate = () => {
    const result = validatePropertyLocation(propertyData);

    if (!result.isValid) {
      setErrors(result.errors);
      setAlert({
        type: "error",
        message:
          "Por favor completa la dirección y ubica la propiedad en el mapa.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setAlert({ type: "", message: "" });
    setErrors({});

    if (validate()) {
      nextStep();
    }
  };

  useEffect(() => {
    if (!propertyData.direccion.estado) {
      const defaultState = "Veracruz";
      const defaultCity = "Xalapa";

      updatePropertyData("direccion", "estado", defaultState);
      updatePropertyData("direccion", "ciudad", defaultCity);
      updateMapLocation(defaultCity, defaultState);
    }
  }, []);

  const selectedStateObj = LOCATIONS.find(
    (l) => l.estado === propertyData.direccion.estado
  );
  const availableCities = selectedStateObj ? selectedStateObj.ciudades : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updatePropertyData("direccion", name, value);
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    updatePropertyData("direccion", "estado", newState);
    if (errors.estado) setErrors({ ...errors, estado: null });

    const newStateObj = LOCATIONS.find((l) => l.estado === newState);
    const firstCity =
      newStateObj && newStateObj.ciudades.length > 0
        ? newStateObj.ciudades[0]
        : "";

    updatePropertyData("direccion", "ciudad", firstCity);
    if (errors.ciudad) setErrors({ ...errors, ciudad: null });

    updateMapLocation(firstCity, newState);
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    updatePropertyData("direccion", "ciudad", newCity);
    if (errors.ciudad) setErrors({ ...errors, ciudad: null });

    updateMapLocation(newCity, propertyData.direccion.estado);
  };

  const handleMapChange = (lat, lng) => {
    updatePropertyData("geolocalizacion", "latitud", lat);
    updatePropertyData("geolocalizacion", "longitud", lng);
    if (errors.mapa) setErrors({ ...errors, mapa: null });
  };

  return (
    <div className={styles.stepContainer}>
      {alert.message && (
        <div style={{ marginBottom: "20px" }}>
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.leftColumnForm}>
          <div className={styles.inputGroup}>
            <label>Calle</label>
            <input
              type="text"
              name="calle"
              placeholder="Av. Xalapa"
              value={propertyData.direccion.calle}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.calle ? styles.inputError : ""
              }`}
            />
            {errors.calle && (
              <span className={styles.errorMessage}>{errors.calle}</span>
            )}
          </div>

          <div className={styles.grid} style={{ gap: "10px", marginTop: 0 }}>
            <div className={styles.inputGroup}>
              <label>Número exterior</label>
              <input
                type="number"
                name="noCalle"
                placeholder="135"
                value={propertyData.direccion.noCalle}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.noCalle ? styles.inputError : ""
                }`}
                min="0"
              />
              {errors.noCalle && (
                <span className={styles.errorMessage}>{errors.noCalle}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Código postal</label>
              <input
                type="text"
                name="codigoPostal"
                placeholder="91029"
                value={propertyData.direccion.codigoPostal}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.codigoPostal ? styles.inputError : ""
                }`}
                maxLength={5}
              />
              {errors.codigoPostal && (
                <span className={styles.errorMessage}>
                  {errors.codigoPostal}
                </span>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Colonia</label>
            <input
              type="text"
              name="colonia"
              placeholder="Obrero campesina"
              value={propertyData.direccion.colonia}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.colonia ? styles.inputError : ""
              }`}
            />
            {errors.colonia && (
              <span className={styles.errorMessage}>{errors.colonia}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Estado</label>
            <select
              name="estado"
              value={propertyData.direccion.estado}
              onChange={handleStateChange}
              className={`${styles.input} ${
                errors.estado ? styles.inputError : ""
              }`}
            >
              <option value="" disabled>
                Selecciona un estado
              </option>
              {LOCATIONS.map((loc) => (
                <option key={loc.estado} value={loc.estado}>
                  {loc.estado}
                </option>
              ))}
            </select>
            {errors.estado && (
              <span className={styles.errorMessage}>{errors.estado}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Ciudad</label>
            <select
              name="ciudad"
              value={propertyData.direccion.ciudad}
              onChange={handleCityChange}
              className={`${styles.input} ${
                errors.ciudad ? styles.inputError : ""
              }`}
              disabled={!propertyData.direccion.estado}
            >
              <option value="" disabled>
                Selecciona una ciudad
              </option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.ciudad && (
              <span className={styles.errorMessage}>{errors.ciudad}</span>
            )}
          </div>
        </div>

        <div className={styles.mapContainer}>
          <div
            style={{
              height: "100%",
              width: "100%",
              border: errors.mapa ? "2px solid #ef4444" : "none",
              borderRadius: "8px",
            }}
          >
            <MapPicker
              lat={propertyData.geolocalizacion.latitud}
              lng={propertyData.geolocalizacion.longitud}
              onChange={handleMapChange}
            />
          </div>

          {errors.mapa ? (
            <p
              className={styles.errorMessage}
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              {errors.mapa}
            </p>
          ) : (
            <p
              className={styles.helperText}
              style={{ textAlign: "center", marginTop: "10px" }}
            >
              Arrastra el marcador para indicar la ubicación exacta.
            </p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={prevStep} className={styles.btnSecondary}>
          Regresar
        </button>
        <button onClick={handleNext} className={styles.btnPrimary}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
