"use client";

import React, { useState } from "react";
import { apiClient } from "@/services/apiClient";
import "./Footer.scss";
import { CloudUpload, Sparkles } from "lucide-react";

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    description: "",
    image: undefined as File | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.full_name || !formData.email || !formData.description) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (!formData.phone) {
      setErrorMessage("Please provide a phone number");
      return;
    }

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("full_name", formData.full_name);
      formPayload.append("phone", formData.phone);
      formPayload.append("email", formData.email);
      formPayload.append("description", formData.description);

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      await apiClient.post("/api/design-requests", formPayload);

      setSuccessMessage(
        "✨ Thank you! Your design request has been submitted!",
      );
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        description: "",
        image: undefined,
      });
      setImagePreview(null);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An error occurred";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="footer-cta" id="custom-design">
        <div className="footer-cta__inner">
          <div className="footer-cta__copy">
            <span className="footer-cta__eyebrow">Bespoke Creations</span>
            <h2 className="footer-cta__title">
              Bring Your Vision to{" "}
              <em className="footer-cta__title-accent">Bloom</em>
            </h2>
            <p className="footer-cta__text">
              Have a specific bouquet in mind? Send us your inspiration, and our
              master makers will twist it into reality.
            </p>
            <div className="footer-cta__highlight">
              <span className="material-symbols-outlined">
                <Sparkles />
              </span>
              <p>Unique pieces crafted just for you</p>
            </div>
          </div>
          <div className="footer-cta__form-wrap ambient-shadow">
            <form className="footer-form" onSubmit={handleSubmit}>
              <div className="footer-form__field">
                <label className="footer-form__label" htmlFor="full_name">
                  Full Name *
                </label>
                <input
                  className="footer-form__input"
                  id="full_name"
                  name="full_name"
                  placeholder="Name"
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="footer-form__field">
                <label className="footer-form__label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="footer-form__input"
                  id="phone"
                  name="phone"
                  placeholder=""
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="footer-form__field">
                <label className="footer-form__label" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="footer-form__input"
                  id="email"
                  name="email"
                  placeholder="alex@example.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="footer-form__field">
                <label className="footer-form__label" htmlFor="description">
                  Design Description
                </label>
                <textarea
                  className="footer-form__textarea"
                  id="description"
                  name="description"
                  placeholder="Tell us about the colors, shapes, or occasion..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="footer-form__field">
                <span className="footer-form__label">
                  Upload Inspiration Image
                </span>
                <label className="footer-form__upload">
                  {imagePreview ? (
                    <div className="footer-form__upload-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div className="footer-form__upload-overlay">
                        <span className="material-symbols-outlined">
                          <CloudUpload />
                        </span>
                        <p>Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="footer-form__upload-inner">
                      <span className="material-symbols-outlined">
                        <CloudUpload />
                      </span>
                      <p className="footer-form__upload-hint">
                        Click to upload or drag and drop
                      </p>
                      <p className="footer-form__upload-meta">
                        PNG, JPG (max. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    className="footer-form__file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({
                        ...prev,
                        image: undefined,
                      }));
                    }}
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 1rem",
                      background: "#fed7d7",
                      color: "#c53030",
                      border: "none",
                      borderRadius: "0.4rem",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {successMessage && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#c6f6d5",
                    color: "#22543d",
                    border: "1px solid #9ae6b4",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#fed7d7",
                    color: "#742a2a",
                    border: "1px solid #fc8181",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                className="footer-form__submit ambient-shadow ambient-shadow-hover press-effect"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__brand-block">
          <div className="site-footer__brand">Edens Bloom</div>
          <p className="site-footer__desc">
            Handcrafted bouquets and artisan floral décor, sourced from
            sustainable farms and delivered with love. Everlasting handcrafted
            artistry for your home.
          </p>
          <div className="site-footer__social">
            <a
              className="site-footer__social-link"
              href="https://www.instagram.com/edensbloom.store/"
            >
              ig
            </a>
            <a
              className="site-footer__social-link"
              href="https://www.edensbloom.store"
            >
              wb
            </a>
            <a
              className="site-footer__social-link"
              href="https://www.facebook.com/profile.php?id=61589409217106&sk=directory_links"
            >
              fb
            </a>
          </div>
        </div>
      </footer>
      <div className="site-footer__bar">
        <span>© 2026 Edens Bloom. Everlasting Handcrafted Artistry.</span>
        <span>Designed with ♡ for Makers</span>
      </div>
    </>
  );
};

export default Footer;
