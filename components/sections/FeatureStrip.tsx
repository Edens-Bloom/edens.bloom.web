import React from "react";

const FeatureStrip: React.FC = () => {
  return (
    <section className="feature-strip">
      <div className="feature-strip__inner">
        <div className="feature-strip__item">
          <span className="material-symbols-outlined">recycling</span>
          <span>Eco-friendly Materials</span>
        </div>
        <div className="feature-strip__item">
          <span className="material-symbols-outlined">volunteer_activism</span>
          <span>Handcrafted with Love</span>
        </div>
        <div className="feature-strip__item">
          <span className="material-symbols-outlined">edit_note</span>
          <span>Custom Designs Available</span>
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
