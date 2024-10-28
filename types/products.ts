export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl: string;
  createdAt: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    stock: 45,
    category: "Electronics",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    createdAt: "2024-10-01",
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description: "Next-generation smartwatch with health tracking",
    price: 399.99,
    stock: 12,
    category: "Wearables",
    status: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    createdAt: "2024-10-05",
  },
  {
    id: "3",
    name: "Professional Camera Kit",
    description: "DSLR camera with advanced features for professionals",
    price: 1299.99,
    stock: 8,
    category: "Photography",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    createdAt: "2024-10-08",
  },
  {
    id: "4",
    name: "Gaming Console Pro",
    description: "4K gaming console with latest graphics technology",
    price: 499.99,
    stock: 0,
    category: "Gaming",
    status: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&q=80",
    createdAt: "2024-10-10",
  },
  {
    id: "5",
    name: "Laptop Ultra Slim",
    description: "Lightweight laptop with powerful performance",
    price: 1099.99,
    stock: 15,
    category: "Computers",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
    createdAt: "2024-10-12",
  },
  {
    id: "6",
    name: "Smartphone Plus",
    description: "Latest smartphone with advanced camera system",
    price: 899.99,
    stock: 25,
    category: "Mobile Devices",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    createdAt: "2024-10-15",
  },
  {
    id: "7",
    name: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with charging case",
    price: 199.99,
    stock: 5,
    category: "Audio",
    status: "low_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80",
    createdAt: "2024-10-18",
  },
  {
    id: "8",
    name: "Smart Home Hub",
    description: "Central control for all your smart home devices",
    price: 149.99,
    stock: 30,
    category: "Smart Home",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80",
    createdAt: "2024-10-20",
  },
  {
    id: "9",
    name: "Fitness Tracker Elite",
    description: "Advanced fitness tracking with heart rate monitoring",
    price: 129.99,
    stock: 0,
    category: "Wearables",
    status: "out_of_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1557438159-53d6f76862c6?w=500&q=80",
    createdAt: "2024-10-22",
  },
  {
    id: "10",
    name: "Tablet Pro 2024",
    description: "Professional tablet with stylus support",
    price: 799.99,
    stock: 18,
    category: "Tablets",
    status: "in_stock",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    createdAt: "2024-10-25",
  },
];
