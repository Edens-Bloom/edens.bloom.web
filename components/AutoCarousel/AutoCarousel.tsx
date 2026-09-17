"use client";

import React, { useEffect, useState } from "react";
import "./AutoCarousel.scss";
import { formatRs } from "@/utils/formatRs";

const items = [
  {
    imageUrl:
      "https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779468/Blue_lily_ktjqwk.jpg",
    price: 900,
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779468/Decor_Flower_d06kvs.jpg",
    price: 250,
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779468/Daisy_dosrrk.jpg",
    price: 200,
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779762/mixed_bouquet_htrkdi.jpg",
    price: 850,
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779468/Blue_lily_ktjqwk.jpg",
    price: 900,
  },
];

function AutoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length < 2) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [currentIndex, isPaused]);

  // =========================
  // SAFETY GUARD
  // =========================
  if (!items.length) return null;

  const goTo = (index: number) => {
    setCurrentIndex((index + items.length) % items.length);
    setIsPaused(true);
  };

  const move = (direction: number) => {
    goTo(currentIndex + direction);
  };

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="carousel-stage" aria-live="polite">
        {items.map((item, index) => {
          const offset =
            ((index - currentIndex + items.length + 2) % items.length) - 2;
          const distance = Math.abs(offset);

          return (
            <button
              className={`carousel-card ${offset === 0 ? "is-active" : ""}`}
              key={`${item.imageUrl}-${index}`}
              style={
                {
                  "--card-x": `${offset * 150}px`,
                  "--card-depth": "clamp(150px, 18vw, 220px)",
                  "--card-scale":
                    offset === 0 ? 1 : distance === 1 ? 0.84 : 0.68,
                  "--card-opacity":
                    offset === 0 ? 1 : distance === 1 ? 0.72 : 0,
                  "--card-blur": `${distance === 0 ? 0 : distance === 1 ? 0.7 : 2}px`,
                  pointerEvents: distance === 2 ? "none" : "auto",
                  zIndex: items.length - distance,
                } as React.CSSProperties
              }
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show product ${index + 1}`}
              aria-pressed={offset === 0}
            >
              <span className="image-wrapper">
                <img src={item.imageUrl} alt={`Product ${index + 1}`} />
                <span className="price-tag">{formatRs(item.price)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        className="carousel-control carousel-control--prev"
        type="button"
        onClick={() => move(-1)}
        aria-label="Previous product"
      >
        <span aria-hidden="true">&#8592;</span>
      </button>
      <button
        className="carousel-control carousel-control--next"
        type="button"
        onClick={() => move(1)}
        aria-label="Next product"
      >
        <span aria-hidden="true">&#8594;</span>
      </button>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to product ${index + 1}`}
            aria-current={currentIndex === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default AutoCarousel;
