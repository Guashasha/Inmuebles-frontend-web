'use client';

import './assets/css/mainMenu.css'

import Button from './components/button.js'
import TopBar from './layouts/topBar.js'
import SearchBar from './components/searchBar.js'

export default function Index() {
  function searchProperties(search) {
    alert(search);
    const selectedCategories = getSelectedCategories();
  }

  function getSelectedCategories() {

  }

  return (
    <div>
      <TopBar />

      <div className="mainContainer">
        <div className="searchControls">
          <p className="componentTitle">Buscar propiedades</p>

          <SearchBar onSearch={searchProperties} />

          <div className="categoriesContainer" >
            Categoría:
            <Button />
            <Button />
            <Button />
          </div>
        </div>
      
        <div className="contentGrid">
          <p className="componentTitle">Propiedades que te podrían gustar</p>
        </div>
      </div>

    </div>
  );
}