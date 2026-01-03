"use client";

import { useState } from 'react';
import ToggleButton from "@components/toggleButton/ToggleButton.js";
import SearchBar from "@components/searchBar/SearchBar.js";
import { PROPERTY_CATEGORIES } from "@constants";
import "./page.module.css";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState([]);

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
              <ToggleButton label={category.label} value={category.id} onToggle={handleCategoryToggle} />
            ))}
          </div>
        </div>

        <div className="contentGrid">
          <p className="componentTitle">Propiedades que te podrían gustar</p>
        </div>
      </div>
    </div>
  );
}
