import React from "react";

const CategorySection: React.FC = () => {
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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgWC_DsdEMVOj91Rcyz1xmTNk2v82h9sydY38aqYAIYrp810Xmi4d2f09OC1Ik0NEjiVEiJblCDuzCPNz78BAE8TZuQGRmBjKzj3KfsDB2nWko_SkoAQvaRwPIexYx8P-yixjgvPnrU3wUb-bjyIEpDGv4Lbd_dlGLIv9hG6RzqE1DFwy_8IEBWPmPqgZp5WjnRk9jEleqlrhXxbHaFsKr7sQ7e0Wpp83yNBiqL7AVQgR90tbXBN6AZnLtVEMpCQpB1aQv5qzPUoU"
            alt="Artisan Bouquets"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content category-tile__content--lg">
            <h3 className="category-tile__heading">Artisan Bouquets</h3>
            <p className="category-tile__meta">48 UNIQUE DESIGNS</p>
            <button
              type="button"
              className="category-tile__btn press-effect"
              aria-label="View category"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="category-tile ambient-shadow">
          <img
            className="category-tile__img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_zwMoh-9XL2e5coNP81XBwS7A2YLc2y52TF08FM5s4c1UXDU7qKFJPv3sWabYYSPnuU_js0_ZFQbNyP5ncMRM3-VTJNzjLuq3G6iRO_z5CUR1f432qMw23f2XsUnaHidT4AztYFBh-cr5vmReBxYUmXiat9AoXvZNbpBa3ikRo4BYds4lkZlcE7GcK4M_fcqrFPyyIdHXJ9FfxoqFTSvpKHFVVFokFOtlFSSQW9l6_ScRwmkV-cZRcdkzkMlbFvvi4dlVjpbduvo"
            alt="DIY Kits"
          />
          <div className="category-tile__gradient" />
          <div className="category-tile__content">
            <h3 className="category-tile__heading category-tile__heading--sm">
              DIY Kits
            </h3>
            <p className="category-tile__meta">LEARN TO TWIST</p>
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
            <h3 className="category-tile__heading category-tile__heading--sm">
              Seasonal
            </h3>
            <p className="category-tile__meta">LIMITED EDITIONS</p>
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
            <h3 className="category-tile__heading category-tile__heading--sm">
              Custom Gifts
            </h3>
            <p className="category-tile__meta">MADE JUST FOR THEM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
