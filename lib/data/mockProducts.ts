// lib/data/mockProducts.ts
import { Product, ProductVariation } from "@/types/products";

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to generate SKUs
const generateSKU = (prefix: string, number: number) => {
  return `${prefix}-${String(number).padStart(6, "0")}`;
};

// Generate random price with 2 decimals
const randomPrice = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

// Sample categories
export const productCategories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Beauty",
  "Food & Beverages",
];

// Sample tags
export const productTags = [
  "New Arrival",
  "Best Seller",
  "Sale",
  "Featured",
  "Limited Edition",
  "Trending",
  "Seasonal",
  "Premium",
];

// Sample variations for different product types
const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const clothingColors = ["Red", "Blue", "Black", "White", "Green", "Yellow"];
const electronicStorages = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const electronicColors = ["Space Gray", "Silver", "Gold", "Black"];

// Generate mock product variations
const generateVariations = (product: Partial<Product>): ProductVariation[] => {
  const variations: ProductVariation[] = [];

  if (product.category === "Clothing") {
    clothingSizes.forEach((size) => {
      clothingColors.slice(0, 3).forEach((color) => {
        variations.push({
          id: `${product.id}-${size}-${color}`.toLowerCase(),
          name: `${product.name} - ${size}/${color}`,
          sku: generateSKU("CLT", Math.floor(Math.random() * 1000000)),
          price: randomPrice(20, 100),
          stock: Math.floor(Math.random() * 50),
          attributes: {
            size,
            color,
          },
        });
      });
    });
  } else if (product.category === "Electronics") {
    electronicStorages.forEach((storage) => {
      electronicColors.slice(0, 2).forEach((color) => {
        variations.push({
          id: `${product.id}-${storage}-${color}`.toLowerCase(),
          name: `${product.name} - ${storage}/${color}`,
          sku: generateSKU("ELC", Math.floor(Math.random() * 1000000)),
          price: randomPrice(500, 2000),
          stock: Math.floor(Math.random() * 30),
          attributes: {
            storage,
            color,
          },
        });
      });
    });
  }

  return variations;
};

// Generate mock products
export const generateMockProducts = (count: number = 50): Product[] => {
  const products: Product[] = [];
  const startDate = new Date("2023-01-01");
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const category =
      productCategories[Math.floor(Math.random() * productCategories.length)];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const tags = [...productTags]
      .sort(() => Math.random() - 0.5)
      .slice(0, numTags);

    const baseProduct: Product = {
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      sku: generateSKU("PRD", i + 1),
      description: `This is a detailed description for Product ${
        i + 1
      }. It includes all the necessary information about the product's features and benefits.`,
      price: randomPrice(10, 1000),
      stock: Math.floor(Math.random() * 100),
      status:
        Math.random() > 0.8
          ? "draft"
          : Math.random() > 0.3
          ? "active"
          : "inactive",
      image: `/api/placeholder/${400}/${400}`,
      category,
      tags,
      createdAt: randomDate(startDate, endDate).toISOString(),
      updatedAt: new Date().toISOString(),
      variations: [],
      performance: {
        views: Math.floor(Math.random() * 10000),
        sales: Math.floor(Math.random() * 1000),
        revenue: randomPrice(5000, 50000),
        returnRate: Number((Math.random() * 5).toFixed(2)),
        rating: Number((3 + Math.random() * 2).toFixed(1)),
        salesTrend: Number((Math.random() * 40 - 20).toFixed(1)), // -20 to +20
      },
    };

    // Add variations for certain categories
    if (["Clothing", "Electronics"].includes(category)) {
      baseProduct.variations = generateVariations(baseProduct);
    }

    products.push(baseProduct);
  }

  return products;
};

// Generate initial mock data
export const mockProducts = generateMockProducts(50);

// Helper function to get a single product
export const getMockProduct = (productId: string): Product | undefined => {
  return mockProducts.find((product) => product.id === productId);
};

// Helper function to update a product
export const updateMockProduct = (
  productId: string,
  updates: Partial<Product>
): Product | undefined => {
  const productIndex = mockProducts.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) return undefined;

  const updatedProduct = {
    ...mockProducts[productIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockProducts[productIndex] = updatedProduct;
  return updatedProduct;
};

// Helper function to delete a product
export const deleteMockProduct = (productId: string): boolean => {
  const productIndex = mockProducts.findIndex(
    (product) => product.id === productId
  );
  if (productIndex === -1) return false;

  mockProducts.splice(productIndex, 1);
  return true;
};

// Simulated API response delay
export const simulateApiCall = async <T>(
  data: T,
  delay: number = 500
): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
};

// Mock API response type
export interface ApiResponse<T> {
  data: T;
  metadata?: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Get paginated products
export const getPaginatedMockProducts = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    category?: string;
    status?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }
): Promise<ApiResponse<Product[]>> => {
  let filteredProducts = [...mockProducts];

  // Apply filters
  if (filters) {
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }
    if (filters.status) {
      filteredProducts = filteredProducts.filter(
        (p) => p.status === filters.status
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.maxPrice!
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        filters.tags!.some((tag) => p.tags?.includes(tag) ?? false)
      );
    }
  }

  // Calculate pagination
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Simulate API delay
  await simulateApiCall(null, 500);

  return {
    data: paginatedProducts,
    metadata: {
      totalCount,
      page,
      pageSize,
      totalPages,
    },
  };
};
