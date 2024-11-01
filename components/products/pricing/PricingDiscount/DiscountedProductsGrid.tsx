import React, { useState } from 'react';
import { DollarSign, Percent, Star, TrendingUp, Edit2, Trash2, BarChart, Save, X, RefreshCw } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  createdAt: string;
  imageUrl: string;
  views: number;
  sales: number;
}

interface DiscountedProductsGridProps {
  items: Product[];
  onSaveEdit: (productId: string, newPrice: number, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
  onViewAnalytics: (productId: string) => void;
  onRestockProduct: (productId: string) => void;
}

const ITEMS_PER_PAGE = 6;

const DiscountedProductsGrid: React.FC<DiscountedProductsGridProps> = ({ items, onSaveEdit, onDeleteProduct, onViewAnalytics, onRestockProduct }) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number | null>(null);
  const [editedStock, setEditedStock] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    return (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24) <= 30;
  };

  const calculateProfitMargin = (price: number, discountedPrice: number) => {
    return ((price - discountedPrice) / price) * 100;
  };

  const startEdit = (product: Product) => {
    setEditMode(product.id);
    setEditedPrice(product.discountedPrice);
    setEditedStock(product.stock);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedPrice(null);
    setEditedStock(null);
  };

  const saveEdit = (productId: string) => {
    if (editedPrice !== null && editedStock !== null) {
      onSaveEdit(productId, editedPrice, editedStock);
      setEditMode(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 border border-gray-200 overflow-hidden transform hover:scale-105 relative"
          >
            {/* Image and Badges */}
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
              {isNewProduct(item.createdAt) && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center shadow-md">
                  <Star size={12} className="mr-1" /> New
                </span>
              )}
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                {calculateProfitMargin(item.price, item.discountedPrice).toFixed(1)}% Off
              </span>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

              {/* Sales and View Stats */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Views: 56</span>
                <span>Sales: 3433</span>
              </div>

              {/* Pricing Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-2">
                <span className="text-xl font-bold text-green-600 flex items-center">
                  <DollarSign size={16} className="mr-1" /> {item.discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">${item.price.toFixed(2)}</span>
              </div>

              {/* Stock and Sales Potential */}
              <p
                className={`text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center mt-2 ${
                  item.status === "in_stock"
                    ? "bg-green-100 text-green-700"
                    : item.status === "low_stock"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.status === "in_stock"
                  ? "In Stock"
                  : item.status === "low_stock"
                  ? "Low Stock"
                  : "Out of Stock"}
              </p>

              {/* Actions and Inline Editing */}
              <div className="flex items-center space-x-2 mt-4">
                {editMode === item.id ? (
                  <>
                    {/* Inline Editing Fields for Price and Stock */}
                    <input
                      type="number"
                      value={editedPrice ?? item.discountedPrice}
                      onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
                      className="w-20 p-1 border border-primary-300 rounded-full text-center"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={editedStock ?? item.stock}
                      onChange={(e) => setEditedStock(parseInt(e.target.value))}
                      className="w-16 p-1 border border-primary-300 rounded-full text-center"
                      placeholder="Stock"
                    />
                    <button onClick={() => saveEdit(item.id)} className="text-green-600">
                      <Save size={16} />
                    </button>
                    <button onClick={cancelEdit} className="text-red-600">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onViewAnalytics(item.id)} className="text-gray-500 hover:text-gray-700 flex items-center">
                      <BarChart size={16} /> 
                    </button>
                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:text-blue-800 flex items-center">
                      <Edit2 size={16} /> 
                    </button>
                    <button onClick={() => onRestockProduct(item.id)} className="text-yellow-600 hover:text-yellow-800 flex items-center">
                      <RefreshCw size={16} /> 
                    </button>
                    <button onClick={() => onDeleteProduct(item.id)} className="text-red-600 hover:text-red-800 flex items-center">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DiscountedProductsGrid;
