export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  images: string[];
  stock_qty: number;
  is_featured: boolean;
  is_new_arrival: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Ghungroo Charm Bracelet', slug: 'ghungroo-charm-bracelet',
    description: 'Delicate ghungroo bells strung on antique gold chain.', price: 450, compare_at_price: null,
    category: 'bracelets', images: [], stock_qty: 12, is_featured: true, is_new_arrival: false
  },
  {
    id: '2', name: 'Pearl Drop Ring', slug: 'pearl-drop-ring',
    description: 'A freshwater pearl set in hammered gold band.', price: 380, compare_at_price: 520,
    category: 'rings', images: [], stock_qty: 8, is_featured: true, is_new_arrival: false
  },
  {
    id: '3', name: 'Candy Bead Phone Strap', slug: 'candy-bead-phone-strap',
    description: 'Pastel candy beads with gold lobster clasp.', price: 280, compare_at_price: null,
    category: 'phone-charms', images: [], stock_qty: 20, is_featured: true, is_new_arrival: true
  },
  {
    id: '4', name: 'Antique Coin Necklace', slug: 'antique-coin-necklace',
    description: 'Layered chain with vintage coin pendants.', price: 650, compare_at_price: 850,
    category: 'necklaces', images: [], stock_qty: 5, is_featured: true, is_new_arrival: false
  },
  {
    id: '5', name: 'Rose Quartz Chip Strap', slug: 'rose-quartz-chip-strap',
    description: 'Natural rose quartz chips on gold chain phone strap.', price: 320, compare_at_price: null,
    category: 'phone-charms', images: [], stock_qty: 15, is_featured: true, is_new_arrival: true
  },
  {
    id: '6', name: 'Temple Jhumka Earrings', slug: 'temple-jhumka-earrings',
    description: 'Ornate temple design jhumka in antique gold.', price: 520, compare_at_price: null,
    category: 'sets', images: [], stock_qty: 7, is_featured: true, is_new_arrival: false
  },
  {
    id: '7', name: 'Minimalist Gold Band', slug: 'minimalist-gold-band',
    description: 'A sleek thin band in polished gold finish.', price: 250, compare_at_price: null,
    category: 'rings', images: [], stock_qty: 25, is_featured: true, is_new_arrival: true
  },
  {
    id: '8', name: 'Kundan Choker Set', slug: 'kundan-choker-set',
    description: 'Traditional kundan choker with matching earrings.', price: 1200, compare_at_price: 1500,
    category: 'sets', images: [], stock_qty: 3, is_featured: true, is_new_arrival: false
  },
];
