import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number.").max(30),
  address: z.string().trim().min(5, "Enter your street address.").max(160),
  city: z.string().trim().min(2, "Enter your city.").max(80),
  country: z.string().trim().min(2, "Choose your country."),
  shippingMethod: z.enum(["standard", "express"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

const productSummarySchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  price: z.number().nonnegative(),
  discountPercentage: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string().url(),
});

export const savedOrderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  customer: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  shippingMethod: z.enum(["standard", "express"]),
  items: z.array(z.object({
    product: productSummarySchema,
    quantity: z.number().int().positive(),
  })),
  subtotal: z.number().nonnegative(),
  savings: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative(),
});
