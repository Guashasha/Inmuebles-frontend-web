"use client";

import {
  PropertyCreationProvider,
  usePropertyCreation,
} from "@context/PropertyContext";
import BasicInfoStep from "./steps/basicInfoStep";
import LocationStep from "./steps/locationStep";
import AmenitiesStep from "./steps/amenitiesStep";
import PublicationStep from "./steps/publicationStep";
import ReturnButton from "@components/returnButton/ReturnButton";
import styles from "./property.module.css";
import { useRouter } from "next/navigation";

function PropertyWizard() {
  const { currentStep } = usePropertyCreation();
  const router = useRouter();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <LocationStep />;
      case 3:
        return <AmenitiesStep />;
      case 4:
        return <PublicationStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ReturnButton onClick={() => router.back()} />

        <h1 className={styles.title}>Publicar nuevo inmueble</h1>
      </div>

      <div className={styles.stepper}>
        {[
          "Información básica",
          "Ubicación",
          "Amenidades y servicios",
          "Publicación",
        ].map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div
              key={index}
              className={`${styles.stepItem} ${
                isActive ? styles.activeStep : ""
              } ${isCompleted ? styles.completedStep : ""}`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className={styles.content}>{renderStep()}</div>
    </div>
  );
}

export default function CreatePropertyPage() {
  return (
    <PropertyCreationProvider>
      <PropertyWizard />
    </PropertyCreationProvider>
  );
}
