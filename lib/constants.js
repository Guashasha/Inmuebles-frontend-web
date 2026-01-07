export const PROPERTY_CATEGORIES = [
  { label: "Departamento", id: "1" },
  { label: "Casa", id: "2" },
  { label: "Terreno / Lote", id: "3" },
  { label: "Comercial / Industrial", id: "4" },
  { label: "Otros", id: "5" },
];

export const PROPERTY_TYPES = [
  {
    id: 1,
    label: "Departamento",
    subtypes: [
      { id: 1, label: "Apartamento de campo" },
      { id: 2, label: "Apartamento de ciudad" },
      { id: 3, label: "Apartamento de playa" },
      { id: 4, label: "Departamento Loft" },
      { id: 5, label: "Departamento PentHouse" },
      { id: 6, label: "Minidepartamento" },
      { id: 7, label: "Departamento compartido" },
    ],
  },
  {
    id: 2,
    label: "Casa",
    subtypes: [
      { id: 8, label: "Casa de campo" },
      { id: 9, label: "Casa de ciudad" },
      { id: 10, label: "Casa de playa" },
      { id: 11, label: "Casa en condominio" },
      { id: 12, label: "Casa en quinta" },
      { id: 13, label: "Dúplex" },
      { id: 14, label: "Villa" },
    ],
  },
  {
    id: 3,
    label: "Terreno / Lote",
    subtypes: [
      { id: 15, label: "Terreno comercial" },
      { id: 16, label: "Terreno campestre" },
      { id: 17, label: "Terreno de playa" },
      { id: 18, label: "Terreno eriazo" },
      { id: 19, label: "Terreno industrial" },
      { id: 20, label: "Terreno residencial" },
    ],
  },
  {
    id: 4,
    label: "Comercial / Industrial",
    subtypes: [
      { id: 21, label: "Bodega comercial" },
      { id: 22, label: "Local Comercial" },
      { id: 23, label: "Nave industrial" },
      { id: 24, label: "Oficina" },
      { id: 25, label: "Edificio" },
    ],
  },
  {
    id: 5,
    label: "Otros",
    subtypes: [
      { id: 26, label: "Huerta" },
      { id: 27, label: "Inmueble productivo urbano" },
      { id: 28, label: "Quinta" },
      { id: 29, label: "Rancho" },
    ],
  },
];

export const LOCATIONS = [
  {
    estado: "Veracruz",
    ciudades: ["Xalapa", "Veracruz", "Coatepec", "Boca del Río", "Córdoba"],
  },
  {
    estado: "Puebla",
    ciudades: ["Puebla", "Cholula", "Atlixco"],
  },
  {
    estado: "CDMX",
    ciudades: ["Coyoacán", "Benito Juárez", "Miguel Hidalgo", "Cuauhtémoc"],
  },
];

export const AMENITIES_LIST = [
  { key: "alberca", label: "Alberca" },
  { key: "balconTerraza", label: "Balcón/Terraza" },
  { key: "bodega", label: "Bodega" },
  { key: "chimenea", label: "Chimenea" },
  { key: "estacionamiento", label: "Estacionamiento" },
  { key: "jacuzzi", label: "Jacuzzi" },
  { key: "jardin", label: "Jardín" },
];

export const SERVICES_LIST = [
  { key: "aguaPotable", label: "Agua potable" },
  { key: "cable", label: "Cable" },
  { key: "drenaje", label: "Drenaje" },
  { key: "electricidad", label: "Electricidad" },
  { key: "gasEstacionario", label: "Gas estacionario" },
  { key: "internet", label: "Internet" },
  { key: "telefono", label: "Teléfono" },
  { key: "transportePublico", label: "Transporte público" },
];
