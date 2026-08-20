import {
  LayoutGrid,
  Hamburger,
  UtensilsCrossed,
  CupSoda,
  Wheat,
  CookingPot,
  Utensils,
  Soup,
  Drumstick,
  Sandwich,
  Pizza,
  Salad,
  Dessert,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  All: LayoutGrid,
  Burgers: Hamburger,
  "Fast Food": UtensilsCrossed,
  Drinks: CupSoda,
  "Pasta & Noodles": Wheat,
  "Rice Meals": CookingPot,
  Appetizers: Utensils,
  Soups: Soup,
  Chicken: Drumstick,
  Sandwiches: Sandwich,
  Pizza: Pizza,
  Salads: Salad,
  Desserts: Dessert,
};

export const DEFAULT_CATEGORY_ICON = Utensils;

export const CATEGORY_ORDER = Object.keys(CATEGORY_ICONS).filter(
  (c) => c !== "All",
);
