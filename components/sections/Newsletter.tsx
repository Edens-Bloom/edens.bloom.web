import React, { useState } from "react";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter__card">
        <div className="newsletter__blob newsletter__blob--tr" aria-hidden />
        <div className="newsletter__blob newsletter__blob--bl" aria-hidden />
        <div className="newsletter__content">
          {subscribed ? (
            <>
              <h2 className="newsletter__title">
                Thank you for{" "}
                <em className="newsletter__title-accent">subscribing!</em>
              </h2>
              <p className="newsletter__lead">
                Check your inbox for your 15% discount code.
              </p>
            </>
          ) : (
            <>
              <h2 className="newsletter__title">
                Get 15% off your{" "}
                <em className="newsletter__title-accent">first order</em>
              </h2>
              <p className="newsletter__lead">
                Join our community for seasonal inspiration, exclusive offers
                &amp; floral tips.
              </p>
              <form className="newsletter__form" onSubmit={handleSubmit}>
                <input
                  className="newsletter__input"
                  placeholder="Your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="newsletter__submit ambient-shadow press-effect"
                >
                  Subscribe
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
