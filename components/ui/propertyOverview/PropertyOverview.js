"use client";

import { useRouter } from "next/navigation";
import "./PropertyOverview.css";
import logo from "@images/logo.svg";

export default function PropertyOverview({ propertyOverviewData }) {
  const router = useRouter();
  const property = propertyOverviewData;

  function goToPropertyDetails() {
    router.push(`/property/propertyDetails?id=${property.idInmueble}`);
  }

  const imageSource =
    property.image && property.image !== "null"
      ? property.image
      : logo.src || logo;

  return (
    <div className="po-card" onClick={goToPropertyDetails}>
      <div className="po-imageContainer">
        <img
          className="po-propertyImage"
          src={imageSource}
          alt={property.title || "Inmueble"}
        />
      </div>
      <div className="po-cardContent">
        <p className="po-title">{property.title}</p>
        <p className="po-city">{property.city}</p>
        <p className="po-price">{property.price}</p>
        <div className="po-footer">
          <p className="po-actionTag">{property.action}</p>
        </div>
      </div>
    </div>
  );
}
