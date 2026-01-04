const apiUrl = process.env.API_URL;
const propertiesUrl = process.env.PROPERTIES_URL;

export async function getRecomendedProperties(page) {
  const url = apiUrl + propertiesUrl + `/recommended?page=${page}`;
  const response = await fetch(url);

  return await response.json();
}

export async function searchProperties(query, category, page = 1) {
  let categoryId;
  switch (category) {
    case "casa":
      categoryId = 1;
      break;
    case "departamento":
      categoryId = 2;
      break;
    case "terreno/lote":
      categoryId = 3;
      break;
    case "comercial/industrial":
      categoryId = 4;
      break;
    case "otros":
      categoryId = 5;
      break;
    default:
      console.error("Categoría de propiedad incorrecta");
      return;
  }

  const url = apiUrl + propertiesUrl + `?titulo=${query}&idCategoria=${categoryId}&page=${page}`;
  const response = await fetch(url);

  return await response.json();
}

export async function createProperty(property) {
  const containsFields = [
    titulo,
    descripcion,
    numBaños,
    numMediosBaños,
    numPisos,
    numRecamaras,
    superficieConstruida,
    superficieTotal,
    antiguedad,
    pisoUbicacion,
    tipoConstruccion,
    referencias,
    direccion,
    subtipo
  ].every(field => field in property);

  if (!containsFields) {
    console.error("La propiedad no tiene todos los campos necesarios");
    return;
  }

  const url = apiUrl + propertiesUrl;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
        // TODO conseguir jwt
        'Authorization': 'Bearer ' + jwt
    },
    body: JSON.stringify(property)
  });

  return await response.json();
}

export async function getPropertyData() {
  //TODO
  return null;
}