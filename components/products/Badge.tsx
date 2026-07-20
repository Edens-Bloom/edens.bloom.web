import React from "react";

export type BadgeType = "sale" | "new" | "hot" | "limited" | "soldout";

export interface BadgeProps {
  type: BadgeType;
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  sale: { label: "Sale", className: "badge--sale" },
  new: { label: "New", className: "badge--new" },
  hot: { label: "Hot", className: "badge--hot" },
  limited: { label: "Limited Edition", className: "badge--limited" },
  soldout: { label: "Sold out", className: "badge--soldout" },
};

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  const config = badgeConfig[type];

  return (
    <span className={`product-card__badge ${config?.className || ""}`}>
      {config?.label || ""}
    </span>
  );
};

export default Badge;
