export type Product = {
  slug: string;
  title: string;
  category: "Anime" | "Oyun" | "Film";
  price: number;
  image: string;
  description: string;
};

import data from "./products.json";

export const products: Product[] = data as Product[];

export function findProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

