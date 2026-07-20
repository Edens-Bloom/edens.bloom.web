import React from "react";
import "./Testimonials.scss";

const reviews = [
  {
    initial: "S",
    name: "Sunita Thapa",
    location: "Kathmandu",
    text: "The Garden Rose Bliss bouquet arrived absolutely perfect. The packaging was elegant and the flowers lasted nearly two weeks. Will definitely order again!",
  },
  {
    initial: "P",
    name: "Priya Sharma",
    location: "Pokhara",
    text: "Ordered the dried pampas bundle for my living room and it's absolutely gorgeous. The quality is exceptional and customer service was so helpful.",
  },
  {
    initial: "A",
    name: "Anisha & Rohan",
    location: "Lalitpur",
    text: "Bloom & Co did our wedding florals and exceeded every expectation. The arrangements were breathtaking and the team was incredibly professional throughout.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="testimonials" id="about">
      <div className="section-header">
        <div className="section-eyebrow">Customer Love</div>
        <h2 className="section-title">
          What they're <em>saying</em>
        </h2>
      </div>
      <div className="testimonials-grid">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="testimonial-card fade-up visible"
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="t-stars">★★★★★</div>
            <p className="testimonial-text">{rev.text}</p>
            <div className="testimonial-author">
              <div className="author-avatar">{rev.initial}</div>
              <div>
                <div className="author-name">{rev.name}</div>
                <div className="author-meta">
                  {rev.location} · Verified buyer
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
