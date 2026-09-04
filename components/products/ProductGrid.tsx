"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/store/useStore";
import { ShoppingBag, X } from "lucide-react";
import type { Product, SelectedProduct } from "@/types";
import { formatRs } from "@/utils/formatRs";
import Badge, { type BadgeType } from "./Badge";
import "./ProductGrid.scss";
import calculatePrice from "@/utils/calculatePrice";
import { DNA } from "react-loader-spinner";

const getSelectedImage = (product: SelectedProduct | null) => {
  if (!product?.id) return product?.imageUrl;
  const imageSrc = product?.selectedImageUrl || product.imageUrl || "/next.svg";
  return (
    <img
      src={imageSrc}
      alt={product.name}
      className="product-modal__main-img"
    />
  );
};

const getCurrentPrice = (product: SelectedProduct | null): number => {
  if (!product) return 0;
  return product.selectedAddOnId
    ? Number(product.selectedAddOnPrice)
    : Number(product.price || 0);
};

const ProductGrid: React.FC = () => {
  const {
    products,
    fetchProducts,
    isLoading,
    error,
    addToCart,
    fetchProductById,
    selectedProduct,
    setSelectedProduct,
    updateSelectedProduct: updateSelected,
    loading: { fetchById: isFetchingById },
  } = useStore();
  const categories = new Set<string>([
    "all",
    ...products.map((p) => p.productType || "others"),
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Ensure body scroll lock is always reset
  useEffect(() => {
    if (selectedProduct?.id) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProduct?.id]);

  const handleProductClick = async (product: Product) => {
    setShowModal(true);
    await fetchProductById(product.id, true);
    // body scroll lock now handled in useEffect
  };

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedProduct({} as SelectedProduct);
    // body scroll lock now handled in useEffect
  }, [setSelectedProduct]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (selectedProduct) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [selectedProduct, handleCloseModal]);

  if (isLoading) {
    return (
      <div className="page-container product-grid__state product-grid__state--loading">
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
        <p className="type-label-md">Loading our beautiful collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container product-grid__state product-grid__state--error">
        <p className="type-label-md">Oops! {error}</p>
        <button
          type="button"
          onClick={() => fetchProducts()}
          className="product-grid__retry"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  };

  const fullStars = selectedProduct
    ? Math.round(Math.min(5, Math.max(0, selectedProduct.rating)))
    : 0;

  return (
    <>
      <section className="product-grid" id="occasions">
        <div className="product-grid__header">
          <div className="product-grid__intro">
            <h2 className="product-grid__title">
              Most <em className="product-grid__title-accent">loved</em>{" "}
              bouquets
            </h2>
          </div>
          <a href="#occasions" className="product-grid__cta">
            View All Products
          </a>
        </div>
        <div className="product-grid__filter-wrap">
          <div className="category-filter">
            <div
              className="category-filter__list"
              role="tablist"
              aria-label="Filter products by category"
            >
              {Array.from(categories).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-item ${selectedCategory === cat ? "category-item--active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-grid__cards">
          {products
            .filter((p) => {
              if (selectedCategory === "all") return true;
              return p.productType === selectedCategory;
            })
            .map((product) => {
              return (
                <div key={product.id} className="product-card fade-up visible">
                  <div className="product-card__media ambient-shadow felt-texture">
                    <button
                      type="button"
                      className="product-card__media-link"
                      aria-label={`View ${product.name}`}
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.imageUrl || "/next.svg"}
                        alt={product.name}
                      />
                    </button>
                    {product.badge && (
                      <Badge type={product.badge as BadgeType} />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="product-card__info">
                      <h4 className="product-card__title" title={product.name}>
                        {product.name}
                      </h4>
                    </div>
                    <div className="product-card__price-row">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {product.oldPrice && (
                          <span className="product-card__old-price">
                            {formatRs(Number(product.oldPrice))}
                          </span>
                        )}
                        <span className="product-card__price">
                          {formatRs(product.price)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="product-card__meta-link"
                      onClick={() => handleProductClick(product)}
                    >
                      <span className="product-card__view-btn">
                        View Detail
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {showModal &&
        createPortal(
          <div className="product-modal-overlay" onClick={handleCloseModal}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              {isFetchingById ? (
                <div className="page-container product-grid__state product-grid__state--loading">
                  <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                  />
                  <p className="type-label-md">
                    Loading our beautiful collection...
                  </p>
                </div>
              ) : (
                <div>
                  <div>
                    <button
                      type="button"
                      className="product-modal__close"
                      onClick={handleCloseModal}
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </button>
                    <div className="product-modal__scroll">
                      <div className="product-modal__grid">
                        <div className="product-modal__gallery">
                          <div className="product-modal__main-img-wrap ambient-shadow">
                            {getSelectedImage(selectedProduct)}
                          </div>
                          {(selectedProduct?.addOns?.length || 0) > 0 && (
                            <div
                              className="product-modal__thumbs"
                              role="tablist"
                              aria-label="Product images"
                            >
                              <button
                                key={`${selectedProduct?.id ?? "none"}-main`}
                                type="button"
                                className={`product-modal__thumb${!selectedProduct?.selectedAddOnId ? " product-modal__thumb--active" : ""}`}
                                onClick={() =>
                                  updateSelected(
                                    calculatePrice({
                                      ...selectedProduct,
                                      selectedAddOnId: null,
                                      selectedAddOnPrice: 0,
                                      selectedImageUrl:
                                        selectedProduct?.imageUrl || "",
                                    }),
                                  )
                                }
                                aria-label={`View image ${1}`}
                              >
                                <img
                                  src={selectedProduct?.imageUrl || "/next.svg"}
                                  alt=""
                                />
                              </button>
                              {selectedProduct?.addOns?.map((addon, i) => (
                                <button
                                  key={addon.id}
                                  type="button"
                                  className={`product-modal__thumb${selectedProduct.selectedAddOnId === addon.id ? " product-modal__thumb--active" : ""}`}
                                  onClick={() =>
                                    updateSelected(
                                      calculatePrice({
                                        ...selectedProduct,
                                        selectedAddOnId: addon.id ?? 0,
                                        selectedAddOnPrice: Number(
                                          addon.price ?? 0,
                                        ),
                                        selectedImageUrl: addon.image_url,
                                      }),
                                    )
                                  }
                                  aria-label={`View image ${i + 1}`}
                                >
                                  <img
                                    src={addon.image_url || "/next.svg"}
                                    alt=""
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="product-modal__info">
                          <div className="product-modal__meta-row">
                            {selectedProduct?.badge ? (
                              <span className="product-modal__badge">
                                {selectedProduct.badge}
                              </span>
                            ) : null}
                            <div
                              className="product-modal__stars"
                              aria-label={`${selectedProduct?.rating ?? 0} out of 5 stars`}
                            >
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < fullStars
                                      ? "product-modal__star"
                                      : "product-modal__star product-modal__star--muted"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "3px",
                            }}
                          >
                            <h1
                              className="product-modal__title"
                              style={{ marginBottom: 0 }}
                            >
                              {selectedProduct?.name}
                            </h1>
                            {selectedProduct?.productNumber && (
                              <span
                                className="product-card__product-number"
                                style={{ margin: 0 }}
                              >
                                Product Number: {selectedProduct?.productNumber}
                              </span>
                            )}
                          </div>
                          <p className="product-modal__price">
                            {formatRs(
                              selectedProduct?.subTotal ??
                                selectedProduct?.price ??
                                0,
                            )}
                            {(selectedProduct?.quantity ?? 1) > 1 && (
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "normal",
                                  marginLeft: "8px",
                                  opacity: 0.8,
                                }}
                              >
                                ({selectedProduct?.quantity ?? 1} &times;{" "}
                                {formatRs(getCurrentPrice(selectedProduct))})
                              </span>
                            )}
                          </p>
                          <p className="product-modal__desc">
                            {selectedProduct?.description}
                          </p>

                          {/* <div>
                      <p className="product-modal__section-label">
                        Bundle &amp; save
                      </p>
                      <div className="product-modal__bundles">
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "single" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("single")}
                        >
                          <div className="product-modal__bundle-title">
                            Single stem
                          </div>
                          <div className="product-modal__bundle-sub">
                            Pay per piece
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(unit + packFee)}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "bundle5" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("bundle5")}
                        >
                          {save5 > 0 ? (
                            <span className="product-modal__bundle-save">
                              Save {formatRs(save5)}
                            </span>
                          ) : null}
                          <div className="product-modal__bundle-title">
                            {bundleTitle5}
                          </div>
                          <div className="product-modal__bundle-sub">
                            Best for a full bouquet
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(bundle5Total + packFee)}
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`product-modal__bundle${bundle === "bundle10" ? " product-modal__bundle--active" : ""}`}
                          onClick={() => setBundle("bundle10")}
                        >
                          {save10 > 0 ? (
                            <span className="product-modal__bundle-save">
                              Save {formatRs(save10)}
                            </span>
                          ) : null}
                          <div className="product-modal__bundle-title">
                            {bundleTitle10}
                          </div>
                          <div className="product-modal__bundle-sub">
                            The ultimate garden gift
                          </div>
                          <div className="product-modal__bundle-price">
                            {formatRs(bundle10Total + packFee)}
                          </div>
                        </button>
                      </div>
                    </div> */}
                          {selectedProduct?.addOns &&
                            selectedProduct.addOns.length > 0 && (
                              <div>
                                <p className="product-modal__section-label">
                                  Packaging selection
                                </p>
                                <div className="product-modal__packaging">
                                  <button
                                    className={`product-modal__pack${!selectedProduct?.selectedAddOnId ? " product-modal__pack--active" : ""}`}
                                    type="button"
                                    onClick={() =>
                                      updateSelected(
                                        calculatePrice({
                                          ...selectedProduct,
                                          selectedAddOnId: null,
                                          selectedAddOnPrice: 0,
                                          selectedImageUrl:
                                            selectedProduct?.imageUrl || "",
                                        }),
                                      )
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="packaging"
                                        checked={
                                          !selectedProduct?.selectedAddOnId
                                        }
                                        onChange={() =>
                                          updateSelected(
                                            calculatePrice({
                                              ...selectedProduct,
                                              selectedAddOnId: null,
                                              selectedAddOnPrice: 0,
                                              selectedImageUrl:
                                                selectedProduct?.imageUrl || "",
                                            }),
                                          )
                                        }
                                      />
                                      <div>
                                        <div className="product-modal__pack-label">
                                          No bag
                                        </div>
                                        <div className="product-modal__pack-price">
                                          {formatRs(
                                            Number(selectedProduct?.price ?? 0),
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </button>

                                  {selectedProduct?.addOns?.map((addon) => (
                                    <button
                                      className={`product-modal__pack${selectedProduct?.selectedAddOnId === addon.id ? " product-modal__pack--active" : ""}`}
                                      key={addon.id}
                                      type="button"
                                      onClick={() =>
                                        updateSelected(
                                          calculatePrice({
                                            ...selectedProduct,
                                            selectedAddOnId: addon.id ?? 0,
                                            selectedAddOnPrice: Number(
                                              addon.price ?? 0,
                                            ),
                                            selectedImageUrl: addon.imageUrl,
                                          }),
                                        )
                                      }
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          checked={
                                            selectedProduct?.selectedAddOnId ===
                                            addon.id
                                          }
                                          onChange={() =>
                                            updateSelected(
                                              calculatePrice({
                                                ...selectedProduct,
                                                selectedAddOnId: addon.id ?? 0,
                                                selectedAddOnPrice: Number(
                                                  addon.price ?? 0,
                                                ),
                                                selectedImageUrl:
                                                  addon.imageUrl,
                                              }),
                                            )
                                          }
                                        />
                                        <div>
                                          <div className="product-modal__pack-label">
                                            {addon.label}
                                          </div>
                                          <div className="product-modal__pack-price">
                                            {formatRs(Number(addon.price ?? 0))}
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          <div className="product-modal__qty-row">
                            <div className="product-modal__qty">
                              <button
                                type="button"
                                className="product-modal__qty-btn"
                                onClick={() => {
                                  updateSelected(
                                    calculatePrice({
                                      ...selectedProduct,
                                      quantity: Math.max(
                                        1,
                                        (selectedProduct?.quantity ?? 1) - 1,
                                      ),
                                    }),
                                  );
                                }}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="product-modal__qty-val">
                                {selectedProduct?.quantity ?? 1}
                              </span>
                              <button
                                type="button"
                                className="product-modal__qty-btn"
                                onClick={() => {
                                  updateSelected(
                                    calculatePrice({
                                      ...selectedProduct,
                                      quantity: Math.min(
                                        10,
                                        (selectedProduct?.quantity ?? 1) + 1,
                                      ),
                                    }),
                                  );
                                }}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="product-modal__add-btn"
                              onClick={handleAddToCart}
                            >
                              <ShoppingBag size={20} aria-hidden />
                              {addedFlash ? "Added to cart" : "Add to cart"}
                            </button>
                          </div>
                          <div className="product-modal__trust">
                            <div className="product-modal__trust-item">
                              <span
                                className="material-symbols-outlined"
                                aria-hidden
                              >
                                eco
                              </span>
                              <div className="product-modal__trust-text">
                                <strong>Sustainable craft</strong>
                                <span>Eco-friendly materials used.</span>
                              </div>
                            </div>
                            <div className="product-modal__trust-item">
                              <span
                                className="material-symbols-outlined"
                                aria-hidden
                              >
                                local_shipping
                              </span>
                              <div className="product-modal__trust-text">
                                <strong>Delicate shipping</strong>
                                <span>Handled with floral wire care.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProductGrid;
