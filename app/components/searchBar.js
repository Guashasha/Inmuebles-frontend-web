'use client';

import { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={e => handleChange(e)}
        placeholder="Departamento en Xalapa, Casa en la playa..."
      />
      <button type="submit" className="primary">Buscar</button>
    </form>
  );
}
