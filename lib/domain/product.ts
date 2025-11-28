// lib/domain/product.ts

export interface Product {
  productId: number;
  description: string;
}

export interface ProductSearchResult {
  items: Product[];
}
