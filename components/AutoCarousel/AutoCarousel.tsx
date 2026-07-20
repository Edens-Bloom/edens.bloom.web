"use client";

import React, { useState, useEffect, useRef } from "react";
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
];

function AutoCarousel() {
  const extendedItems = items.length > 0 ? [...items, items[0]] : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =========================
  // AUTO SLIDE TIMER
  // =========================
  const startTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
  };

  // =========================
  // HANDLE TAB VISIBILITY
  // =========================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause when tab inactive
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else {
        // Reset safely when user returns
        setIsTransitioning(false);
        setCurrentIndex((prev) => prev % items.length);

        requestAnimationFrame(() => {
          setIsTransitioning(true);
          startTimer();
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // =========================
  // RUN TIMER ON INDEX CHANGE
  // =========================
  useEffect(() => {
    startTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  // =========================
  // INFINITE LOOP HANDLER
  // =========================
  const handleTransitionEnd = () => {
    if (currentIndex === extendedItems.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Re-enable transition after reset
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  // =========================
  // SAFETY GUARD
  // =========================
  if (!extendedItems.length) return null;

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedItems.map((item, index) => (
          <div className="carousel-slide" key={index}>
            <div className="image-wrapper">
              <img src={item.imageUrl} alt={`Product ${index + 1}`} />
              <div className="price-tag">{formatRs(item.price)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="carousel-dots">
        {items.map((_, index) => (
          <span
            key={index}
            className={`dot ${
              currentIndex % items.length === index ? "active" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default AutoCarousel;
