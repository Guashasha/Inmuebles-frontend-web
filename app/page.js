'use client';

import Button from './components/button.js'
import SearchBar from './components/searchBar.js'

export default function Index() {
  return (
    <div>
      <Button text="hola mundo" onClick={showHello}/>
      <Button text="adios mundo" onClick={showBye} type='secondary'/>
      <SearchBar onSearch={showHello} />
    </div>
  );
}

function showHello() {
  alert("hola mundo");
}

function showBye() {
  alert("adios mundo");
}