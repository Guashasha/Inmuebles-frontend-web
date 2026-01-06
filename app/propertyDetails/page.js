"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Popup from "reactjs-popup";
import Slider from "react-slick";
import ReturnButton from "@components/returnButton/ReturnButton";
import Contact from "./contact/Contact";
import Visit from "./visit/Visit";
import BuyOrRent from "./buyOrRent/BuyOrRent";
import {
  getPropertyData,
  getPropertyImages,
  contactLandlord,
  scheduleVisitToProperty,
} from "@services/PropertyService.js";
import noImage from "@icons/no-image.svg";
import locationIcon from "@icons/location.svg";
import "./propertyDetails.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PropertyDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const propertyId = searchParams.id;

  function returnToMainMenu() {
    router.back();
  }

  function contactLandlordClick() {
    return (
      contactLandlord(property.idInmueble).data || {
        telefono: "1237896540",
        correo: "ejemplo@correo.com",
      }
    );
  }

  function buyOrRent() {
    router.push("/propertyDetails/buyOrRent");
  }

  function scheduleVisit(date) {
    if (!date) {
      alert("Ingrese una fecha.");
      return;
    }

    const response = scheduleVisitToProperty(property.idInmueble, date).data;
    alert(response.mensaje);
  }

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

    appendDots: (dots) => (
      <div>
        <ul
          style={{
            margin: "0px",
            padding: "0px",
          }}
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  async function retrieveData() {
    const propertyData = await getPropertyData(propertyId);

    propertyData != null
      ? setProperty(propertyData.data)
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

  async function retrieveImages() {
    const images = await getPropertyImages(property.idInmueble);
    console.log(images);

    images != null
      ? setPropertyImages(images.data)
      : setPropertyImages([
          { id: 1, nombre: "test.png", imagenRender: noImage },
          { id: 1, nombre: "test.png", imagenRender: noImage },
        ]);
  }

  useEffect(() => {
    retrieveData();
  }, []);

  useEffect(() => {
    if (property && property.idInmueble) {
      retrieveImages();
    }
  }, [property]);

  if (!property) {
    return <p>cargando</p>;
  }

  // componentes ui
  function Title() {
    return (
      <div className="navigation-container">
        <ReturnButton onClick={returnToMainMenu} />
        <div className="title-container">
          <h1>{property.titulo}</h1>
          <p>{property.Direccion.ciudad}</p>
        </div>
      </div>
    );
  }

  function Carousel() {
    return (
      <div className="carousel">
        <Slider {...carouselSettings}>
          {propertyImages.map((image) => (
            <div className="property-image">
              <Image
                className="property-image"
                alt="imagen de inmueble"
                width="100"
                src={image.imagenRender}
                key={image.id}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  function PropertyCategories() {
    return (
      <div className="categories-container">
        <p className="category-tag">
          {property.SubtipoInmueble.CategoriaInmueble.nombre}
        </p>
        <p className="category-tag">{property.SubtipoInmueble.nombre}</p>
      </div>
    );
  }

  function ExtraPropertyInfo() {
    return (
      <div className="extra-info-container">
        <div>
          <p>Amenidades</p>
        </div>
        <div>
          <p>Servicios</p>
        </div>
      </div>
    );
  }

  function PriceModule() {
    return (
      <div className="price-container">
        <p>Precio</p>
        <p>
          {property.Publicacion.tipoOperacion === "Venta"
            ? "$" + property.Publicacion.precioVenta
            : "$" + property.Publicacion.precioRentaMensual + "/mes"}
        </p>
        <p>Disponible para {property.Publicacion.tipoOperacion}</p>
        <Popup
          trigger={
            <button className="secondary-button">Contactar arrendador</button>
          }
          position="right center"
          modal
          nested
        >
          {(close) => (
            <Contact onButtonClick={close} landlord={contactLandlordClick()} />
          )}
        </Popup>
        <Popup
          trigger={
            <button className="secondary-button">Programar visita</button>
          }
        >
          {(close) => (
            <Visit
              propertyId={property.idInmueble}
              scheduleVisit={scheduleVisit}
              close={close}
            />
          )}
        </Popup>
        <Popup
          trigger={
            <button className="primary-button">
              {property.Publicacion.tipoOperacion === "Venta"
                ? "Comprar"
                : "Rentar"}
            </button>
          }
          position="right center"
          modal
          nested
        >
          <BuyOrRent onPay={buyOrRent} />
        </Popup>
      </div>
    );
  }

  function LocationModule() {
    return (
      <div className="map-container">
        <div>
          <p>Ubicación</p>
          <Image alt="icono ubicacion" src={locationIcon} width="30" />
        </div>
        {/* Aquí ubicación*/}
      </div>
    );
  }

  return (
    <div>
      <div className="main-content">
        <div className="left-side-content">
          <Title />
          <div className="property-info">
            <Carousel />
            <PropertyCategories />
            <p className="description">{property.descripcion}</p>
            <ExtraPropertyInfo />
          </div>
        </div>

        <div className="side-bar">
          <PriceModule />
          <LocationModule />
        </div>
      </div>
    </div>
  );
}
