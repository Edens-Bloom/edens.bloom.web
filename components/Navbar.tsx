"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import "./Navbar.scss";
import { ShoppingCart, UserRound, X } from "lucide-react";
import Logo from "./Logo";
import type { User } from "@/types";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getCartCount, user, logout, rehydrate, updateUser } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    // Defer loading persisted state until after first render
    // to prevent server/client HTML mismatches during hydration.
    rehydrate?.();
  }, [rehydrate]);

  const shopActive = pathname === "/" || /^\/item\/\d+/.test(pathname);
  const ordersActive = pathname === "/orders";

  const handleOpenProfile = () => {
    setProfileForm({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    });
    setIsProfileOpen(true);
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateUser(profileForm as Partial<User>);
    setIsProfileOpen(false);
  };

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <Logo />
        <Link href="/" className="site-nav__brand">
          Edens Bloom
        </Link>
        <div className="site-nav__links">
          <Link
            href="/#occasions"
            className={`site-nav__link${shopActive ? " site-nav__link--active" : ""}`}
          >
            Shop
          </Link>

          <Link href="/#custom-design" className="site-nav__link">
            Custom
          </Link>

          {user && (
            <Link
              href="/orders"
              className={`site-nav__link${ordersActive ? " site-nav__link--active" : ""}`}
            >
              My Orders
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin"
                className="site-nav__link site-nav__link--danger"
              >
                Manage
              </Link>
              <Link
                href="/admin/design-requests"
                className="site-nav__link site-nav__link--danger"
              >
                Designs
              </Link>
            </>
          )}
        </div>

        <div className="site-nav__actions">
          <Link
            href="/cart"
            className="site-nav__cart press-effect"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">
              <ShoppingCart />
            </span>
            {getCartCount() > 0 && (
              <span className="site-nav__cart-badge">{getCartCount()}</span>
            )}
          </Link>
          <button
            type="button"
            className="site-nav__avatar"
            onClick={handleOpenProfile}
            aria-label="Open profile details"
          >
            <UserRound size={12} />
            <span>
              {/* {(user.name || user.username || "U").charAt(0).toUpperCase()} */}
            </span>
          </button>

          {user && (
            <div className="site-nav__user">
              <button
                type="button"
                onClick={logout}
                className="site-nav__logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isProfileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="profile-modal-overlay"
            onClick={() => setIsProfileOpen(false)}
          >
            <div
              className="profile-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="profile-modal__close"
                onClick={() => setIsProfileOpen(false)}
                aria-label="Close profile details"
              >
                <X size={20} />
              </button>
              <div className="profile-modal__heading">
                <div className="profile-modal__avatar">
                  {/* {(user.name || user.username || "U").charAt(0).toUpperCase()} */}
                </div>
                <h2 id="profile-modal-title">Profile details</h2>
                <p>Update the details used for your orders.</p>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <label>
                  Full name
                  <input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
                <label>
                  Phone number
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </label>
                <label>
                  Address
                  <input
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    required
                  />
                </label>
                <button type="submit" className="profile-modal__save">
                  Save details
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
};

export default Navbar;
