import { useStore } from "@/store/useStore";
import { ArrowRight } from "lucide-react";

const ActionButton = ({ category }: { category: string }) => {
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);

  const handleClick = () => {
    if (category === "custom-design") {
      document.getElementById("custom-design")?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }
    setSelectedCategory(category);
    document.getElementById("all-products")?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <button
      type="button"
      className="category-tile__btn press-effect"
      aria-label="View category"
      onClick={handleClick}
    >
      <span className="material-symbols-outlined">
        <ArrowRight size={20} />
      </span>
    </button>
  );
};

export default ActionButton;
