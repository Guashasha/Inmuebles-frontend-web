"use client";
import { useState } from "react";
import "./ImageCarousel.css";

export default function ImageCarousel({ images, altTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="carousel-placeholder">
        <span>Imagen no disponible</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentUrl = images[currentIndex]?.url;

  return (
    <div className="carousel-container">
      <img
        src={currentUrl}
        alt={`${altTitle} - Foto ${currentIndex + 1}`}
        className="carousel-image"
      />

      {images.length > 1 && (
        <>
          <button onClick={prevImage} className="carousel-btn prev">
            ‹
          </button>
          <button onClick={nextImage} className="carousel-btn next">
            ›
          </button>

          <div className="carousel-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
