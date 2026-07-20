"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import "./Navbar.scss";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getCartCount, user, logout } = useStore();

  const shopActive = pathname === "/" || /^\/item\/\d+/.test(pathname);

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
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
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="site-nav__link site-nav__link--danger"
            >
              Manage
            </Link>
          )}
        </div>

        <div className="site-nav__actions">
          <Link
            href="/cart"
            className="site-nav__cart press-effect"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {getCartCount() > 0 && (
              <span className="site-nav__cart-badge">{getCartCount()}</span>
            )}
          </Link>

          {user && (
            <div className="site-nav__user">
              <span className="site-nav__username"></span>
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
    </nav>
  );
};

export default Navbar;
