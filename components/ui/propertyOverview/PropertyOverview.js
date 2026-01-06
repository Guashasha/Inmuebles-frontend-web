"use client";

import { useRouter } from "next/navigation";
// import { useState } from "react";
import "./PropertyOverview.css";
import logo from "@images/logo.png";

export default function PropertyOverview({ propertyOverviewData }) {
  const router = useRouter();
  const property = propertyOverviewData;

  function goToPropertyDetails() {
    console.log("Navegando a propiedad con ID:", property.idInmueble); // <-- DEBUG

    if (!property.idInmueble) {
      alert("Error: Esta propiedad no tiene ID válido.");
      return;
    }

    //router.push(`/property/propertyDetails/${property.idInmueble}`);
    router.push(`/property/propertyDetails?id=${property.idInmueble}`);
  }

  const imageSource =
    property.image && property.image !== "null"
      ? property.image
      : logo.src || logo;

  return (
    <div className="card" onClick={goToPropertyDetails}>
      <div className="imageContainer">
        <img
          className="propertyImage"
          src={imageSource}
          alt={property.title || "Inmueble"}
        />
      </div>
      <div className="cardContent">
        <p className="tag title">{property.title}</p>
        <p className="cityTag">{property.city}</p>
        <p className="tag price">{property.price}</p>
        <p className="actionTag">{property.action}</p>
      </div>
    </div>
  );
}
