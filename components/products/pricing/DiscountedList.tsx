// DiscountedList.tsx
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Percent, Star, TrendingUp } from 'lucide-react';
import { useRouter } from "next/navigation";


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  category: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  imageUrl: string;
  createdAt: string;
  pricing: string;
}

interface DiscountedListProps {
  items: Product[];
  onViewAll: () => void;
}

const DiscountedList: React.FC<DiscountedListProps> = ({ items, onViewAll }) => {
  const router = useRouter();

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    return daysDifference <= 30;
  };

  const calculateProfitMargin = (price: number, discountedPrice: number) => {
    return ((price - discountedPrice) / price) * 100;
  };

  const getSalesPotential = (stock: number, price: number) => {
    if (stock > 50 && price < 100) return "High Potential";
    if (stock > 20 && stock <= 50) return "Moderate Potential";
    return "Low Potential";
  };

  const handleRowClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="space-y-4   ">
      {items.slice(0, 5).map((item) => (
      <motion.div
      key={item.id}
      className="p-4 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-start border border-gray-200 hover:bg-gray-50 transition duration-200 w-64 sm:w-full"
      whileHover={{ scale: 1.02 }}
      onClick={() => handleRowClick(item.id)}
      >
          {/* Product Image with Badge */}
          <div className="relative w-full sm:w-auto flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 sm:w-16 sm:h-16 object-cover rounded-lg"
            />
            {isNewProduct(item.createdAt) && (
              <motion.span
                className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              >
                <Star size={12} className="mr-1" /> New
              </motion.span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>

            {/* Price and Profit Margin */}
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-green-600 flex items-center">
                <DollarSign size={16} className="mr-1" /> {item.discountedPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">${item.price}</span>
              <span className="text-xs text-blue-500 font-medium flex items-center">
                {calculateProfitMargin(item.price, item.discountedPrice).toFixed(1)} 
                <Percent size={14} className="mr-1" />

                Margin
              </span>
            </div>
          </div>

          {/* Stock Status and Sales Potential */}
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <p
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                item.status === "in_stock"
                  ? "bg-green-100 text-green-800"
                  : item.status === "low_stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              } flex items-center`}
            >
              <TrendingUp size={12} className="mr-1" />
              {item.status === "in_stock"
                ? "In Stock"
                : item.status === "low_stock"
                ? "Low Stock"
                : "Out of Stock"}
            </p>

            {/* Sales Potential Badge */}
            <span
              className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full flex items-center ${
                getSalesPotential(item.stock, item.discountedPrice) === "High Potential"
                  ? "bg-green-500 text-white"
                  : getSalesPotential(item.stock, item.discountedPrice) === "Moderate Potential"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              <Star size={12} className="mr-1" />
              {getSalesPotential(item.stock, item.discountedPrice)}
            </span>

            {/* Stock Progress Bar */}
            {item.status !== "out_of_stock" && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    item.status === "in_stock"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${(item.stock / 100) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* View All Button */}
      <div className="flex justify-end mt-6">
        <button
      onClick={() =>     router.push(`/products/discount`)
    }
        
          className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-full shadow hover:bg-primary-600 transition duration-200 flex items-center"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default DiscountedList;
