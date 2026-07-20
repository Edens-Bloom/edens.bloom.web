"use client";

import React from "react";
import AutoCarousel from "../AutoCarousel/AutoCarousel";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__eyebrow-row">
          <span className="hero__eyebrow-line" aria-hidden />
          <span className="hero__eyebrow">New Season Collection</span>
        </div>
        <h1 className="hero__title">
          Flowers that last <span className="hero__title-accent">forever</span>
        </h1>
        <p className="hero__lead">
          Handcrafted pipe cleaner bouquets and artisan decor, reimagined for
          the modern maker. Vibrant, flexible, and forever in bloom.
        </p>
        <div className="hero__actions">
          <a
            href="#occasions"
            className="btn-primary-solid ambient-shadow ambient-shadow-hover press-effect"
          >
            Shop Now
          </a>
          <a href="#category" className="btn-outline-round press-effect">
            Browse Occasions
          </a>
        </div>
        <div className="hero__stats">
          <div>
            <div className="hero__stat-value">15+</div>
            <div className="hero__stat-label">Vibrant Hues</div>
          </div>
          <div>
            <div className="hero__stat-value">4.9★</div>
            <div className="hero__stat-label">Maker Rating</div>
          </div>
          <div>
            <div className="hero__stat-value">Same Day</div>
            <div className="hero__stat-label">Shipping</div>
          </div>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__glow" aria-hidden />
        <AutoCarousel />
      </div>
    </section>
  );
};

export default Hero;
