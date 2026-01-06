"use client";

import { createContext, useContext, useState } from "react";

const PropertyContext = createContext();

export const usePropertyCreation = () => useContext(PropertyContext);

export const PropertyCreationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [propertyData, setPropertyData] = useState({
    titulo: "",
    descripcion: "",
    subtipoId: "",
    arrendadorId: "",

    detallesFisicos: {
      numRecamaras: 0,
      numBaños: 0,
      numMediosBaños: 0,
      superficieTotal: 0,
      superficieConstruida: 0,
      mascotasPermitidas: false,
      numPisos: 1,
      antiguedad: "",
      pisoUbicacion: 0,
    },

    direccion: {
      calle: "",
      noCalle: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
    },

    geolocalizacion: {
      latitud: 0,
      longitud: 0,
    },

    amenidades: {
      balconTerraza: false,
      bodega: false,
      chimenea: false,
      estacionamiento: false,
      jacuzzi: false,
      jardin: false,
      alberca: false,
    },

    servicios: {
      aguaPotable: false,
      cable: false,
      drenaje: false,
      electricidad: false,
      gasEstacionario: false,
      internet: false,
      telefono: false,
      transportePublico: false,
    },

    publicacion: {
      tipoOperacion: "Renta",
      precio: 0,
      divisa: "MXN",
      requiereAval: false,
    },

    referencias: "",
  });

  const updatePropertyData = (section, field, value) => {
    setPropertyData((prev) => {
      if (!section) {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <PropertyContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        propertyData,
        updatePropertyData,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
