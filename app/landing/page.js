"use client";

import { useState } from "react";
import ToggleButton from "@components/toggleButton/ToggleButton.js";
import SearchBar from "@components/searchBar/SearchBar.js";
import PropertyOverview from "@components/propertyOverview/PropertyOverview";
import { PROPERTY_CATEGORIES } from "@constants";
import "./landing.css";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const properties = [
    {
      idInmueble: "1",
      title: "Casa de campo",
      city: "Xalapa",
      price: "$10,000",
      action: "Renta",
    },
    {
      idInmueble: "2",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "3",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "4",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "5",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "6",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "7",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    },
    {
      idInmueble: "8",
      title: "Departamento",
      city: "Xalapa",
      price: "$8,000",
      action: "Renta",
    },
    {
      idInmueble: "9",
      title: "Departamento en el centro",
      city: "Coatepec",
      price: "$100,000",
      action: "Renta",
    }
  ];

  function searchProperties(search) {
    alert(selectedCategories);
  }

  function handleCategoryToggle(categoryId, isToggled) {
    setSelectedCategories((prev) => {
      if (isToggled) {
        return prev.includes(categoryId) ? prev : [...prev, categoryId];
      } else {
        return prev.filter((id) => id !== categoryId);
      }
    });
  }

  return (
    <div>
      <div className="mainContainer">
        <div className="searchControls">
          <p className="componentTitle">Buscar propiedades</p>

          <SearchBar onSearch={searchProperties} />

          <div className="categoriesContainer">
            <p>Categoría:</p>
            {PROPERTY_CATEGORIES.map((category) => (
              <ToggleButton
                key={category.id}
                label={category.label}
                value={category.id}
                onToggle={handleCategoryToggle}
              />
            ))}
          </div>
        </div>

        <p className="componentTitle">Propiedades que te podrían gustar</p>
        <div className="propertiesGrid">
          {properties.map((property) => (
            <PropertyOverview
              key={property.idInmueble}
              propertyOverviewData={property}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
