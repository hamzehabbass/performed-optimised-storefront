export type ProductSummary = {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
};

export type ProductReview = {
  rating: number;
  comment: string;
  reviewerName: string;
  date: string;
};

export type Product = ProductSummary & {
  description: string;
  images: string[];
  tags: string[];
  reviews: ProductReview[];
};

export type ProductSnapshot = {
  snapshotDate: string;
  total: number;
  categories: string[];
  products: ProductSummary[];
};

export type CartItem = {
  product: ProductSummary;
  quantity: number;
};

export type ShippingMethod = "standard" | "express";

export type SavedOrder = {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  shippingMethod: ShippingMethod;
  items: CartItem[];
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
};
