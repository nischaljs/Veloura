export interface ProductImage {
  url: string;
  altText?: string;
}

export interface ProductCategory {
  name: string;
}

export interface ProductBrand {
  name: string;
}

export interface ProductVendor {
  businessName: string;
}

export interface AllProduct {
  id: string | number;
  name: string;
  price: number;
  salePrice?: number | null;
  image?: ProductImage;
  shortDescription?: string;
  description?: string;
  category?: ProductCategory;
  status?: 'ACTIVE' | 'DRAFT' | 'INACTIVE' | string;
  stockQuantity?: number;
  brand?: ProductBrand;
  vendor?: ProductVendor;
  sku?: string;
  rating?: number;
  reviewCount?: number;
} 