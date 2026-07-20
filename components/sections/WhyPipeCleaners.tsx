"use client";

import React from "react";

const WhyPipeCleaners: React.FC = () => {
  return (
    <section className="why-section" id="tutorials">
      <div className="why-section__inner">
        <div className="why-section__cards">
          <div className="why-section__col">
            <div className="why-card ambient-shadow">
              <span className="material-symbols-outlined">all_inclusive</span>
              <h3 className="why-card__title">Never Fade</h3>
              <p className="why-card__text">
                Vibrant beauty that lasts forever without a single drop of
                water.
              </p>
            </div>
            <div className="why-card ambient-shadow">
              <span className="material-symbols-outlined">palette</span>
              <h3 className="why-card__title">Unique Textures</h3>
              <p className="why-card__text">
                The soft, fuzzy tactile feel of felt and wire in artistic
                harmony.
              </p>
            </div>
          </div>
          <div className="why-section__col why-section__col--offset">
            <div className="why-card ambient-shadow">
              <span className="material-symbols-outlined">eco</span>
              <h3 className="why-card__title">Eco-Conscious</h3>
              <p className="why-card__text">
                Sustainable materials crafted to minimize environmental waste.
              </p>
            </div>
            <div className="why-card ambient-shadow">
              <span className="material-symbols-outlined">architecture</span>
              <h3 className="why-card__title">Fully Pliable</h3>
              <p className="why-card__text">
                Bend, twist, and reshape your stems to fit any vase or vision.
              </p>
            </div>
          </div>
        </div>
        <div className="why-section__copy">
          <span className="why-section__eyebrow">Our Philosophy</span>
          <h2 className="why-section__title">
            Why <em className="why-section__title-accent">Pipe Cleaner</em>{" "}
            Flowers?
          </h2>
          <p className="why-section__body">
            In a world of fleeting moments, we create lasting memories. Our pipe
            cleaner flowers aren&apos;t just crafts, they&apos;re artisanal
            sculptures that capture the whimsy of childhood and the
            sophistication of modern art.
          </p>
          <p className="why-section__body">
            Each petal is hand-twisted by our master makers, ensuring that no
            two blooms are ever identical. Experience the joy of a bouquet that
            truly stays with you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyPipeCleaners;
