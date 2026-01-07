"use client";
import { usePropertyCreation } from "@context/PropertyContext";
import { AMENITIES_LIST, SERVICES_LIST } from "@constants";
import styles from "../property.module.css";

export default function AmenitiesStep() {
  const { propertyData, updatePropertyData, nextStep, prevStep } =
    usePropertyCreation();

  const handleToggle = (section, key) => {
    const currentValue = propertyData[section][key];
    updatePropertyData(section, key, !currentValue);
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Amenidades</h3>
        <div className={styles.checkboxGrid}>
          {AMENITIES_LIST.map((item) => (
            <label key={item.key} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={propertyData.amenidades[item.key]}
                onChange={() => handleToggle("amenidades", item.key)}
                className={styles.checkboxInput}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <h3 className={styles.sectionTitle}>Servicios</h3>
        <div className={styles.checkboxGrid}>
          {SERVICES_LIST.map((item) => (
            <label key={item.key} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={propertyData.servicios[item.key]}
                onChange={() => handleToggle("servicios", item.key)}
                className={styles.checkboxInput}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={prevStep} className={styles.btnSecondary}>
          Regresar
        </button>
        <button onClick={nextStep} className={styles.btnPrimary}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
