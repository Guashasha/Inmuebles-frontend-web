'use client';

import { useState } from 'react';
import "./SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value)
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="searchBar">
      <input
        type="text"
        value={query}
        onChange={e => handleChange(e)}
        placeholder="Departamento en Xalapa, Casa en la playa..."
        id="searchBar"
      />
      <button type="submit" className="primary-button">Buscar</button>
    </form>
  );
}
