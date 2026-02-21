export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

export const products: Product[] = [
  { id: "1", name: "Pro Tennis Racket", price: 189.99, category: "Rackets", description: "Tournament-grade carbon fiber racket with optimal balance." },
  { id: "2", name: "Training Tennis Balls (12-pack)", price: 24.99, category: "Balls", description: "High-visibility pressurized tennis balls for consistent bounce." },
  { id: "3", name: "Performance Sports Shorts", price: 49.99, category: "Apparel", description: "Lightweight moisture-wicking shorts with zippered pockets." },
  { id: "4", name: "Athletic Tank Top", price: 39.99, category: "Apparel", description: "Breathable mesh-back tank top for intense training sessions." },
  { id: "5", name: "Sports Grip Tape (3-pack)", price: 12.99, category: "Accessories", description: "Absorbent overgrip tape for superior racket handling." },
  { id: "6", name: "Tennis Bag - Tournament", price: 79.99, category: "Bags", description: "Thermal-lined bag with space for 3 rackets and gear." },
  { id: "7", name: "Court Training Shoes", price: 129.99, category: "Footwear", description: "All-court shoes with Herringbone sole pattern for grip." },
  { id: "8", name: "Resistance Band Set", price: 34.99, category: "Training", description: "5-level resistance bands for sports-specific conditioning." },
];
