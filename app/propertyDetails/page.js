"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import ReturnButton from "@components/returnButton/ReturnButton";
import { getPropertyData } from "@services/PropertyService.js";
import prevImage from "@icons/more.svg";
import nextImage from "@icons/more.svg";

export default function PropertyDetails() {
  const router = useRouter();
  const [property, setProperty] = useState(null);

  function returnToMainMenu() {
    router.back();
  }

  useEffect(() => {
    async function retrieveData() {
      const propertyData = await getPropertyData();

      propertyData != null
        ? setProperty(propertyData)
        : setProperty({
            idInmueble: 15,
            titulo: "Casa moderna en el centro",
            descripcion: "Hermosa casa con acabados de lujo...",
            numRecamaras: 3,
            numBaños: 2,
            numMediosBaños: 1,
            superficieTotal: 200,
            superficieConstruida: 180,
            mascotasPermitidas: true,
            numPisos: 2,
            antiguedad: 5,
            pisoUbicacion: null,
            referencias: "Cerca del parque central",
            idArrendador: 101,
            idSubtipo: 2,
            idDireccion: 45,
            fechaCreacion: "2023-10-27T10:00:00.000Z",

            Direccion: {
              idDireccion: 45,
              calle: "Av. Principal",
              noCalle: "123",
              colonia: "Centro",
              ciudad: "Xalapa",
              estado: "Veracruz",
              codigoPostal: 91000,
            },

            Publicacion: {
              idPublicacion: 88,
              tipoOperacion: "Venta",
              estado: "Publicada",
              divisa: "MXN",
              precioVenta: 2500000,
              precioRentaMensual: null,
              requiereAval: false,
              depositoRequerido: false,
              montoDeposito: null,
              plazoMinimoMeses: null,
              plazoMaximoMeses: null,
              precioPorM2: 12500,
              fechaPublicacion: "2023-10-27T10:00:00.000Z",
              idInmueble: 15,
            },

            Amenidades: {
              idAmenidad: 12,
              balconTerraza: true,
              bodega: false,
              chimenea: false,
              estacionamiento: true,
              jacuzzi: false,
              jardin: true,
              alberca: false,
              idInmueble: 15,
            },

            Geolocalizacion: {
              idGeolocalizacion: 5,
              latitud: 19.5432,
              longitud: -96.9231,
              idInmueble: 15,
            },

            Servicios: {
              idServicio: 7,
              aguaPotable: true,
              cable: true,
              drenaje: true,
              electricidad: true,
              gasEstacionario: true,
              internet: true,
              telefono: false,
              transportePublico: true,
              idInmueble: 15,
            },

            SubtipoInmueble: {
              idSubtipo: 2,
              nombre: "Residencial",
              idCategoria: 1,
              CategoriaInmueble: {
                idCategoria: 1,
                nombre: "Casa",
              },
            },
          });
    }

    retrieveData();
  }, []);

  if (!property) {
    return <p>cargando</p>
  }

  return (
    <div>
      <div className="main-content">
        <div className="left-side-content">
          <div className="title-container">
            <ReturnButton onClick={returnToMainMenu} />
            <h1>{property.titulo}</h1>
            <p className="city-tag">{property.Direccion.ciudad}</p>
          </div>

          <div className="property-info">
            <div className="image-controls">
              <button className="prev-img-button">
                <Image src={prevImage}/>
              </button>
              <Image className="property-image" src={prevImage} />
              <button className="next-img-button">
                <Image src={nextImage}/>
              </button>
            </div>

            <div className="categories-container">
              <p className="category-tag">categoría</p>
              <p className="category-tag">sub-categoría</p>
            </div>

            <p className="description">{property.descripcion}</p>

            <div className="extra-info-container">
              <div className="extra-info"></div>
              <div className="extra-info"></div>
            </div>
          </div>
        </div>
        <div className="side-bar"></div>
      </div>
    </div>
  );
}
