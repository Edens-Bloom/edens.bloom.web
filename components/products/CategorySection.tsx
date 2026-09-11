"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { useStore } from "@/store/useStore";
import ActionButton from "./Button";

const CategorySection: React.FC = () => {
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);

  return (
    <section className="category-section" id="category">
      <div className="category-section__header">
        <span className="category-section__eyebrow">Browse by Category</span>
        <h2 className="category-section__title">
          Find your perfect{" "}
          <em className="category-section__title-accent">arrangement</em>
        </h2>
      </div>
      <div className="category-bento">
        <div className="category-tile category-tile--hero ambient-shadow">
          <img
            className="category-tile__img"
            src="https://res.cloudinary.com/dkjqlvdxx/image/upload/v1779779468/Blue_lily_ktjqwk.jpg"
            alt="Artisan Bouquets"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content category-tile__content--lg">
            <div>
              <h3 className="category-tile__heading">Artisan Bouquets</h3>
              <p className="category-tile__meta">UNIQUE DESIGNS</p>
            </div>
            <ActionButton category="bouquet" />
          </div>
        </div>

        <div className="category-tile ambient-shadow">
          <img
            className="category-tile__img"
            src="https://res.cloudinary.com/dkjqlvdxx/image/upload/v1789134652/materials_sk9w0i.jpg"
            alt="DIY Kits"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content">
            <div>
              <h3 className="category-tile__heading category-tile__heading--sm">
                DIY Kits
              </h3>
              <p className="category-tile__meta">LEARN TO TWIST</p>
            </div>
            <ActionButton category="diy-kit" />
          </div>
        </div>

        <div className="category-tile ambient-shadow">
          <img
            className="category-tile__img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg66pGn8t7gV-iM4LPBueEnVqMGtmnB7JHEsys0xhOj-ugPBFJvNL7dADenwnEXiNT6ZKrJQ3vKBaDoKZKHX-lgJgNFY5kYQQDdnLCGWYoVePZSGg7vEmFdQTt9vaCVkfZzE25poIIe9wq6-jogcUDAdrFoR59GYfWz2o8qgrTjoemFs_hjmwix4qMrotCJldIfUbD89Fzbb4XhMxnWxrfhcsf1opGHX-OO-jX0txG_pR_h1FNYRxXNJTkMMuz4u65PmonrLOf9ds"
            alt="Seasonal"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content">
            <div>
              <h3 className="category-tile__heading category-tile__heading--sm">
                Gifts
              </h3>
              <p className="category-tile__meta">MADE JUST FOR THEM</p>
            </div>
            <ActionButton category="gift" />
          </div>
        </div>

        <div className="category-tile category-tile--wide ambient-shadow">
          <img
            className="category-tile__img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZNbbNG30b1Zti4GOMoEYRH-AMExuHD4i0ZC6iveJWm1LDRTbZzPZHUgr5F1KbS_J7fQpRUHYZP4ykq3GE6nOZdCXtgcZYM144lRet4shWDk6KV6C229Rjt6wFWbjnW4aCYbB1PLLGfcyOofvapkZQDtjiebxZazqwCvlo3CK8b4abyZmXCO354MQAfK129bnlJfSWk8TORf8Xj4aJV_v9GqV8ekL5c3bGCh9bScfD2xHKTk8xqpkYG58YmAowhzBrk2UHwg4QcQ4"
            alt="Custom Gifts"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content">
            <div>
              <h3 className="category-tile__heading category-tile__heading--sm">
                Custom Gifts
              </h3>
              <p className="category-tile__meta">MADE JUST FOR THEM</p>
            </div>
            <ActionButton category="custom-design" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
