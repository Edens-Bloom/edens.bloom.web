import React from "react";
import Hero from "@/components/sections/Hero";
import FeatureStrip from "@/components/sections/FeatureStrip";
import ProductGrid from "@/components/products/ProductGrid";
import WhyPipeCleaners from "@/components/sections/WhyPipeCleaners";

export default function Home() {
  return (
    <div className="home-sections">
      <Hero />
      <FeatureStrip />
      <ProductGrid />
      <WhyPipeCleaners />
    </div>
  );
}
