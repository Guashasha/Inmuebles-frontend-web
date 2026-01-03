"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import "./PropertyOverview.css";

import logo from "@images/logo.png";

export default function PropertyOverview({ propertyOverviewData }) {
  const [property, setProperty] = useState(propertyOverviewData);
  const router = useRouter();

  function goToPropertyDetails() {
    router.push("propertyDetails");
  }

  return (
    <div className="card" onClick={goToPropertyDetails}>
      <img
        className="propertyImage"
        src={logo}
      />
      <p className="tag">{property.title}</p>
      <p className="cityTag">{property.city}</p>
      <p className="tag">{property.price}</p>
      <p className="actionTag">{property.action}</p>
    </div>
  );
}
