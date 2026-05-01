import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Video } from "@/data/videos";

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="relative w-full bg-background border-b border-border/50 py-3 mb-6">
      <div className="container mx-auto px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 md:gap-4 w-max min-w-full">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full whitespace-nowrap",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground hover:text-primary bg-muted/50 hover:bg-muted"
                )}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
