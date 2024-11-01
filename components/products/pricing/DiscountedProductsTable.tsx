// DiscountedProductsTable.tsx
"use client"
import React, { useState } from 'react';
import { DollarSign, Percent, Star, TrendingUp, BarChart, Edit2, Save, X, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";

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
}

interface DiscountedProductsTableProps {
  items: Product[];
  onSaveEdit: (productId: string, newPrice: number, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
}

const ITEMS_PER_PAGE = 10;

const DiscountedProductsTable: React.FC<DiscountedProductsTableProps> = ({ items, onSaveEdit, onDeleteProduct }) => {
  const router = useRouter();
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number | null>(null);
  const [editedStock, setEditedStock] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
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

  const getSalesPotential = (stock: number, price: number) => {
    if (stock > 50 && price < 100) return "High Potential";
    if (stock > 20 && stock <= 50) return "Moderate Potential";
    return "Low Potential";
  };

  const handleRowClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const startEdit = (product: Product) => {
    setEditRow(product.id);
    setEditedPrice(product.discountedPrice);
    setEditedStock(product.stock);
  };

  const cancelEdit = () => {
    setEditRow(null);
    setEditedPrice(null);
    setEditedStock(null);
  };

  const saveEdit = (productId: string) => {
    if (editedPrice !== null && editedStock !== null) {
      onSaveEdit(productId, editedPrice, editedStock);
      setEditRow(null);
    }
  };

  const requestDelete = (productId: string) => setConfirmDelete(productId);

  const confirmDeleteProduct = (productId: string) => {
    onDeleteProduct(productId);
    setConfirmDelete(null);
  };

  const sortedItems = [...items]
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig !== null) {
        const { key, direction } = sortConfig;
        const compareA = key === 'discountedPrice' ? a[key] : a.stock;
        const compareB = key === 'discountedPrice' ? b[key] : b.stock;
        if (compareA < compareB) return direction === 'ascending' ? -1 : 1;
        if (compareA > compareB) return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key: 'discountedPrice' | 'stock') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full mx-auto p-2 md:p-4 ">
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-800">
            <th className="p-4">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4 cursor-pointer" onClick={() => handleSort('discountedPrice')}>
              Discounted Price
            </th>
            <th className="p-4">Profit Margin</th>
            <th className="p-4 cursor-pointer" onClick={() => handleSort('stock')}>
              Stock Status
            </th>
            <th className="p-4">Sales Potential</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 hover:bg-gray-100 transition ${getSalesPotential(item.stock, item.discountedPrice) === "High Potential" ? "bg-green-50" : ""}`}
            >
              <td className="p-4 flex items-center space-x-3">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                <div>
                  <div className="font-semibold text-gray-800">{item.name}</div>
                  {isNewProduct(item.createdAt) && (
                    <span className="inline-flex items-center text-xs font-semibold text-blue-500">
                      <Star size={12} className="mr-1" /> New
                    </span>
                  )}
                </div>
              </td>

              <td className="p-4 text-gray-500 line-through">${item.price.toFixed(2)}</td>
              <td className="p-4">
                {editRow === item.id ? (
                  <input
                    type="number"
                    value={editedPrice || item.discountedPrice}
                    onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
                    className="w-20 p-1 border rounded text-right"
                  />
                ) : (
                  <span className="text-green-600 font-bold">${item.discountedPrice.toFixed(2)}</span>
                )}
              </td>

              <td className="p-4 text-blue-500 font-medium ">
                {calculateProfitMargin(item.price, item.discountedPrice).toFixed(1)}%
               
              </td>

              <td className="p-4">
                {editRow === item.id ? (
                  <input
                    type="number"
                    value={editedStock || item.stock}
                    onChange={(e) => setEditedStock(parseInt(e.target.value))}
                    className="w-16 p-1 border rounded text-right"
                  />
                ) : (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center ${
                      item.status === "in_stock" ? "bg-green-100 text-green-800" :
                      item.status === "low_stock" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <TrendingUp size={12} className="mr-1" />
                    {item.status.replace('_', ' ')}
                  </span>
                )}
              </td>

              <td className="p-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center ${
                    getSalesPotential(item.stock, item.discountedPrice) === "High Potential" ? "bg-green-500 text-white" :
                    getSalesPotential(item.stock, item.discountedPrice) === "Moderate Potential" ? "bg-yellow-500 text-white" : "bg-gray-400 text-white"
                  }`}
                >
                  <Star size={12} className="mr-1" />
                  {getSalesPotential(item.stock, item.discountedPrice)}
                </span>
              </td>

              <td className="p-4 space-x-2 ">
                {editRow === item.id ? (
                  <>
                    <button onClick={() => saveEdit(item.id)} className="text-green-600">
                      <Save size={18} />
                    </button>
                    <button onClick={cancelEdit} className="text-red-600">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="text-blue-600">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleRowClick(item.id)} className="text-gray-600">
                      <BarChart size={18} />
                    </button>
                    <button onClick={() => requestDelete(item.id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                    {confirmDelete === item.id && (
                      <div className="absolute bg-white shadow-lg rounded p-2 border mt-1">
                        <p className="text-sm">Confirm delete?</p>
                        <button onClick={() => confirmDeleteProduct(item.id)} className="text-red-600">Yes</button>
                        <button onClick={() => setConfirmDelete(null)} className="ml-2 text-gray-600">No</button>
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination, bottom-right */}
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
          className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DiscountedProductsTable;
