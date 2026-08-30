"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useStore } from "@/store/useStore";
import {
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  Star,
  MessageSquare,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Pencil,
  Upload,
} from "lucide-react";
import { formatRs } from "@/utils/formatRs";
import type { Product, SelectedProduct } from "@/types";
import compressImage from "@/utils/compress";
import INITIAL_ADDONS from "@/constants/add-ons";
import PRODUCT_PACKAGE from "@/constants/product-package";
import { productService } from "@/services/productService";

interface PackageItem {
  id: string;
  label: string;
  price: string;
  file: File | null;
  preview: string | null;
}

export interface AddonItem {
  id?: string;
  label: string;
  price: string;
  isDefault: boolean;
  file: File | null;
  preview: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  productId?: number;
  tempId?: number;
  isDirty?: boolean;
}

const AdminProducts: React.FC = () => {
  const {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    isLoading,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPackagesDropdown, setShowPackagesDropdown] = useState(false);
  const [showAddonsDropdown, setShowAddonsDropdown] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>(PRODUCT_PACKAGE);
  const [addons, setAddons] = useState<AddonItem[]>(INITIAL_ADDONS);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "Roses",
    productType: "others",
    badge: "",
    rating: "5",
    description: "",
    inStock: "true",
  });

  const resetForm = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
    setFormData({
      name: "",
      price: "",
      oldPrice: "",
      category: "Roses",
      productType: "others",
      badge: "",
      rating: "5",
      description: "",
      inStock: "true",
    });
    setPackages(PRODUCT_PACKAGE);
    setAddons(INITIAL_ADDONS);
  };

  const handleEditClick = async (product: Product) => {
    try {
      const productDetails = await productService.fetchById(product.id);
      setEditingProduct(product);
      setShowForm(true);
      setFormData({
        name: productDetails.name || "",
        price: productDetails.price?.toString() || "",
        oldPrice: productDetails.oldPrice?.toString() || "",
        category: productDetails.category || "Roses",
        productType: productDetails.productType || "others",
        badge: productDetails.badge || "",
        rating: productDetails.rating?.toString() || "5",
        description: productDetails.description || "",
        inStock: productDetails.inStock?.toString() || "true",
      });
      setMainImagePreview(productDetails.imageUrl || null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setAddons(
        (productDetails.addOns ?? []).map((addon) => ({
          id: addon.id?.toString(),
          label: addon.label || "",
          price: addon.price?.toString() || "",
          isDefault: Boolean(addon.is_default),
          file: null,
          preview: addon.imageUrl || addon.image_url || null,
          imageUrl: addon.imageUrl || addon.image_url || null,
          sortOrder: undefined,
          productId: product.id,
          tempId: undefined,
          isDirty: false,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(productId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];

      if (name === "mainImage") {
        compressImage(file).then((compressedFile) => {
          setMainImageFile(compressedFile);
          const reader = new FileReader();
          reader.onloadend = () => setMainImagePreview(reader.result as string);
          reader.readAsDataURL(compressedFile);
        });
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (
    index: number,
    field: "label" | "price",
    value: string,
  ) => {
    setPackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePackageFileChange = (index: number, file: File | null) => {
    if (!file) return;
    compressImage(file).then((compressedFile) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPackages((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            file: compressedFile,
            preview: reader.result as string,
          };
          return updated;
        });
      };
      reader.readAsDataURL(compressedFile);
    });
  };

  const handleAddonChange = (
    index: number,
    field: "label" | "price" | "isDefault",
    value: string | boolean,
  ) => {
    setAddons((prev) => {
      const updated = [...prev];
      if (field === "isDefault") {
        // Only one can be default
        updated.forEach((addon, idx) => {
          addon.isDefault = idx === index;
          addon.isDirty = true;
        });
      } else {
        updated[index] = { ...updated[index], [field]: value, isDirty: true };
      }
      return updated;
    });
  };

  const handleAddonFileChange = (index: number, file: File | null) => {
    if (!file) return;
    compressImage(file).then((compressedFile) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddons((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            file: compressedFile,
            imageUrl: reader.result as string,
            isDirty: true,
          };
          return updated;
        });
      };
      reader.readAsDataURL(compressedFile);
    });
  };

  const addAddon = () => {
    setAddons((prev) => [
      ...prev,
      {
        tempId: prev?.length + 1,
        label: "",
        price: "",
        isDefault: false,
        file: null,
        preview: null,
        isDirty: true,
      },
    ]);
  };

  const removeAddon = (index: number) => {
    setAddons((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // Add basic product info
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Add main image
    if (mainImageFile) data.append("mainImage", mainImageFile);

    // Add packages
    const packagesData = packages
      .map((pkg) => ({
        label: pkg.label,
        price: pkg.price,
      }))
      .filter((pkg) => pkg.label || pkg.price);
    data.append("packages", JSON.stringify(packagesData));

    // Add packages images
    packages.forEach((pkg, idx) => {
      if (pkg.file) data.append(`packageImage_${idx}`, pkg.file);
    });

    // Add addons
    const addonsData = addons
      .filter((addon) => addon.label && addon.isDirty)
      .map((addon) => ({
        label: addon.label,
        price: addon.price,
        id: addon.id,
        imageUrl: addon.imageUrl,
        isDefault: addon.isDefault,
        sortOrder: addon.sortOrder,
        productId: addon.productId,
        tempId: addon.tempId,
      }));
    data.append("addons", JSON.stringify(addonsData));
    // Add addon images
    addons.forEach((addon) => {
      if (addon.file) {
        if (addon.id) {
          data.append(`addonImage_${addon.id}`, addon.file);
        } else {
          data.append(`addonImage_new_${addon.tempId}`, addon.file);
        }
      }
    });

    let success: boolean;
    if (editingProduct) {
      success = await updateProduct(
        editingProduct.id,
        data as unknown as Partial<Product>,
      );
    } else {
      success = await addProduct(data as unknown as SelectedProduct);
    }

    if (success) {
      handleCloseForm();
    }
  };

  return (
    <div
      className="admin-products"
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingTop: "100px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>
          Product Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#4a5568",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Plus size={20} />
          {editingProduct ? "Cancel" : "Add New Product"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>
            {editingProduct ? "Edit Bouquet" : "Create New Bouquet"}
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            {/* Main Product Info */}
            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Roses">Roses</option>
                <option value="Mixed">Mixed</option>
                <option value="Peonies">Peonies</option>
                <option value="Wildflowers">Wildflowers</option>
                <option value="Dried">Dried</option>
              </select>
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Product Type *
              </label>
              <input
                type="text"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                placeholder="Enter product type"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Old Price (Rs)
              </label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                step="0.01"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Badge (e.g., Sale, New)
              </label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                In Stock
              </label>
              <select
                name="inStock"
                value={formData.inStock}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #ddd",
                }}
              ></textarea>
            </div>

            {/* Main Image */}
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#2d3748",
                }}
              >
                Product Image
              </label>
              <div
                style={{
                  position: "relative",
                  width: "45%",
                  aspectRatio: "2/1",
                  background: "#f8fafc",
                  border: "2px dashed #e2e8f0",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleChange}
                  accept="image/*"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    zIndex: 2,
                    cursor: "pointer",
                  }}
                />
                {mainImagePreview ? (
                  <img
                    src={mainImagePreview}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "#a0aec0",
                    }}
                  >
                    <ImageIcon size={32} style={{ marginBottom: "0.5rem" }} />
                    <span>Upload Product Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Packages Dropdown */}
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <button
                type="button"
                onClick={() => setShowPackagesDropdown(!showPackagesDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                <Package size={20} />
                Product Packages (Buy Quantity Deals)
                {showPackagesDropdown ? (
                  <ChevronUp size={20} style={{ marginLeft: "auto" }} />
                ) : (
                  <ChevronDown size={20} style={{ marginLeft: "auto" }} />
                )}
              </button>

              {showPackagesDropdown && (
                <div
                  style={{
                    marginTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  {packages.map((pkg, idx) => (
                    <div
                      key={pkg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Label (e.g., Buy 5 Get 1 Free)"
                        value={pkg.label}
                        onChange={(e) =>
                          handlePackageChange(idx, "label", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #ddd",
                          fontSize: "0.85rem",
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Price (Rs)"
                        value={pkg.price}
                        onChange={(e) =>
                          handlePackageChange(idx, "price", e.target.value)
                        }
                        step="0.01"
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #ddd",
                          fontSize: "0.85rem",
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1",
                          background: "#f8fafc",
                          border: "2px dashed #e2e8f0",
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="file"
                          onChange={(e) =>
                            e.target.files &&
                            handlePackageFileChange(idx, e.target.files[0])
                          }
                          accept="image/*"
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            zIndex: 2,
                            cursor: "pointer",
                          }}
                        />
                        {pkg.preview ? (
                          <img
                            src={pkg.preview}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              color: "#a0aec0",
                              fontSize: "0.75rem",
                            }}
                          >
                            <ImageIcon size={20} />
                            Upload
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Addons Dropdown */}
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <button
                type="button"
                onClick={() => setShowAddonsDropdown(!showAddonsDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                <Tag size={20} />
                Product Add-ons (Bags & Extras)
                {showAddonsDropdown ? (
                  <ChevronUp size={20} style={{ marginLeft: "auto" }} />
                ) : (
                  <ChevronDown size={20} style={{ marginLeft: "auto" }} />
                )}
              </button>

              {showAddonsDropdown && (
                <div
                  style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}
                >
                  {addons.map((addon, idx) => (
                    <div
                      key={addon.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 0.8fr 0.3fr 0.2fr",
                        gap: "1rem",
                        alignItems: "center",
                        padding: "1rem",
                        background: "#f8fafc",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Label (e.g., Paper Bag)"
                        value={addon.label}
                        onChange={(e) =>
                          handleAddonChange(idx, "label", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #ddd",
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Price (Rs)"
                        value={addon.price}
                        onChange={(e) =>
                          handleAddonChange(idx, "price", e.target.value)
                        }
                        step="0.01"
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          borderRadius: "0.4rem",
                          border: "1px solid #ddd",
                        }}
                      />

                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "1",
                          background: "#f8fafc",
                          border: "2px dashed #e2e8f0",
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="file"
                          onChange={(e) =>
                            e.target.files &&
                            handleAddonFileChange(idx, e.target.files[0])
                          }
                          accept="image/*"
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            zIndex: 2,
                            cursor: "pointer",
                          }}
                        />

                        {addon.imageUrl ? (
                          <img
                            src={addon.imageUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : addon.imageUrl ? (
                          <img
                            src={addon.imageUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              color: "#a0aec0",
                              fontSize: "0.75rem",
                            }}
                          >
                            <ImageIcon size={20} />
                            <span>Upload</span>
                          </div>
                        )}
                      </div>
                      {addons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddon(idx)}
                          style={{
                            background: "#fed7d7",
                            color: "#c53030",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "0.4rem",
                            cursor: "pointer",
                          }}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAddon}
                    style={{
                      padding: "0.75rem",
                      background: "#e6fffa",
                      color: "#0f766e",
                      border: "1px dashed #13b0a0",
                      borderRadius: "0.4rem",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    + Add Another Add-on
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                gridColumn: "span 2",
                padding: "1rem",
                background: "#38a169",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {isLoading
                ? editingProduct
                  ? "Updating..."
                  : "Creating..."
                : editingProduct
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </form>
        </div>
      )}

      <div
        className="products-list"
        style={{
          background: "white",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead
            style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
          >
            <tr>
              <th style={{ padding: "1rem" }}>Product</th>
              <th style={{ padding: "1rem" }}>Category</th>
              <th style={{ padding: "1rem" }}>Price</th>
              <th style={{ padding: "1rem" }}>Type</th>
              <th style={{ padding: "1rem" }}>Badge</th>
              <th style={{ padding: "1rem" }}>Stats</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => handleEditClick(product)}
                style={{
                  borderBottom: "1px solid #edf2f7",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f7fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td
                  style={{
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {product.imageUrl && (
                    <img
                      src={
                        product.imageUrl ||
                        (product as Product & { image?: string }).image ||
                        ""
                      }
                      alt=""
                      style={{
                        objectFit: "cover",
                        borderRadius: "0.3rem",
                        width: "50px",
                        height: "50px",
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: "600" }}>{product.name}</div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.description}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.6rem",
                      background: "#ebf8ff",
                      color: "#2b6cb0",
                      borderRadius: "1rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: "600" }}>
                    {formatRs(Number(product.price))}
                  </div>
                  {product.oldPrice && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#a0aec0",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatRs(Number(product.oldPrice))}
                    </div>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  {product.productType || "-"}
                </td>
                <td style={{ padding: "1rem" }}>{product.badge || "-"}</td>
                <td style={{ padding: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Star size={12} fill="#ecc94b" color="#ecc94b" />{" "}
                    {product.rating}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <MessageSquare size={12} color="#a0aec0" />{" "}
                    {product.reviews}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditClick(product)}
                      style={{
                        color: "#4a5568",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, product.id)}
                      style={{
                        color: "#e53e3e",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.25rem",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
