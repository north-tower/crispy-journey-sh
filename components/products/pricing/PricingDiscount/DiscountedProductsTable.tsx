// DiscountedProductsTable.tsx
"use client"
import React, { useState } from 'react';
import {  Star, TrendingUp, BarChart, Edit2, Save, X, Trash2, } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Product } from '@/types/products';
import clsx from 'clsx';

interface DiscountedProductsTableProps {
  items: Product[];
  onSaveEdit: (productId: string, newPrice: number, newStock: number) => void;
  onDeleteProduct: (productId: string) => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const DiscountedProductsTable: React.FC<DiscountedProductsTableProps> = ({ items, onSaveEdit, onDeleteProduct, isLoading = false }) => {
  const router = useRouter();
  const [editRow, setEditRow] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number | null>(null);
  const [editedStock, setEditedStock] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
 
  const [filter, ] = useState<{ status?: string; salesPotential?: string; minProfitMargin?: number }>({});
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const calculateProfitMargin = (price: number, discountedPrice: number) => {
    return ((price - discountedPrice) / price) * 100;
  };

  const handleSort = (key: keyof Product) => {
    setSortOrder((prev) => (sortKey === key && prev === "asc" ? "desc" : "asc"));
    setSortKey(key);
  };

  const startEdit = (product: Product) => {
    setEditRow(product.id);
    setEditedPrice(product.discountedPrice);
    setEditedStock(product.stock);
  };

  const saveEdit = (productId: string) => {
    if (editedPrice !== null && editedStock !== null) {
      onSaveEdit(productId, editedPrice, editedStock);
      cancelEdit();
    }
  };

  const getSalesPotential = (stock: number, price: number) => {
    if (stock > 50 && price < 100) return "High Potential";
    if (stock > 20 && stock <= 50) return "Moderate Potential";
    return "Low Potential";
  };
  
  const cancelEdit = () => {
    setEditRow(null);
    setEditedPrice(null);
    setEditedStock(null);
  };

  const filteredAndSortedItems = items
    .filter((item) => {
      const profitMargin = calculateProfitMargin(item.price, item.discountedPrice);
      if (filter.status && item.status !== filter.status) return false;
      if (filter.salesPotential && getSalesPotential(item.stock, item.discountedPrice) !== filter.salesPotential) return false;
      if (filter.minProfitMargin !== undefined && profitMargin < filter.minProfitMargin) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const order = sortOrder === "asc" ? 1 : -1;
      return a[sortKey] > b[sortKey] ? order : -order;
    });

  const currentItems = filteredAndSortedItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full mx-auto p-2 md:p-4">
      {/* Filter and Bulk Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          
          {selectedItems.size > 0 && (
            <button
              onClick={() => selectedItems.forEach((id) => onDeleteProduct(id))}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600"
            >
              Delete Selected ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full bg-white rounded-lg shadow-md overflow-x-auto">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-800">
            <th className="p-4">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedItems(new Set(e.target.checked ? items.map((item) => item.id) : []))
                }
              />
            </th>
            <th className="p-4">Product</th>
            <th className="p-4 cursor-pointer" onClick={() => handleSort("price")}>Price</th>
            <th className="p-4 cursor-pointer" onClick={() => handleSort("discountedPrice")}>Discounted Price</th>
            <th className="p-4 cursor-pointer" onClick={() => handleSort("profitMargin")}>Profit Margin</th>
            <th className="p-4">Stock Status</th>
            <th className="p-4">Sales Potential</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={8} className="p-4">Loading...</td></tr>
          ) : currentItems.length === 0 ? (
            <tr><td colSpan={8} className="p-4 text-center">No products found</td></tr>
          ) : (
            currentItems.map((item) => (
              <tr
                key={item.id}
                className={clsx("border-b border-gray-200 hover:bg-gray-100", editRow === item.id && "bg-primary-100")}
              >
                <td className="p-4">
                <input
  type="checkbox"
  checked={selectedItems.has(item.id)}
  onChange={() => {
    const updated = new Set(selectedItems);
    if (updated.has(item.id)) {
      updated.delete(item.id); // Remove the item if it exists
    } else {
      updated.add(item.id); // Add the item if it doesn't exist
    }
    setSelectedItems(updated);
  }}
/>

                </td>
                <td className="p-4 flex items-center space-x-3">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <div className="font-semibold text-gray-800">{item.name}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-500 line-through">${item.price.toFixed(2)}</td>
                <td className="p-4 text-green-600 font-bold">
                {editRow === item.id ? (
                    <input
                      type="number"
                      value={editedPrice || item.discountedPrice}
                      onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
                      className="w-20 p-1 rounded-full border border-primary-300 text-right"
                    />
                  ) : (
                    <span className="text-green-600 font-bold">${item.discountedPrice.toFixed(2)}</span>
                  )}
                </td>
                <td className={clsx("p-4 font-medium", calculateProfitMargin(item.price, item.discountedPrice) >= 0 ? "text-green-600" : "text-red-600")}>
                  {calculateProfitMargin(item.price, item.discountedPrice).toFixed(1)}%
                </td>
                <td className="p-4">
                  {editRow === item.id ? (
                    <input
                      type="number"
                      value={editedStock || item.stock}
                      onChange={(e) => setEditedStock(parseInt(e.target.value))}
                      className="w-16 p-1 border rounded-full text-right border-primary-300"
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
                  <span className={clsx("text-xs font-semibold px-2 py-1 rounded-full flex items-center",   {
                    "bg-green-500 text-white": getSalesPotential(item.stock, item.discountedPrice) === "High Potential",
                    "bg-yellow-500 text-white": getSalesPotential(item.stock, item.discountedPrice) === "Moderate Potential",
                    "bg-gray-400 text-white": getSalesPotential(item.stock, item.discountedPrice) === "Low Potential",
                  })}>
                    <Star size={12} className="mr-1" />
                    {getSalesPotential(item.stock, item.discountedPrice)}
                  </span>
                </td>
                <td className="p-4 space-x-2">
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
                      <button onClick={() => router.push(`/products/${item.id}`)} className="text-gray-600">
                        <BarChart size={18} />
                      </button>
                      <button onClick={() => setConfirmDelete(item.id)} className="text-red-600">
                        <Trash2 size={18} />
                      </button>
                      {confirmDelete === item.id && (
                        <div className="absolute bg-white shadow-lg rounded p-2 border mt-1">
                          <p className="text-sm">Confirm delete?</p>
                          <button onClick={() => onDeleteProduct(item.id)} className="text-red-600">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="ml-2 text-gray-600">No</button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <label className="text-sm text-gray-600">Items per page:</label>
          <select
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
            className="ml-2 p-1 border rounded"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountedProductsTable;
