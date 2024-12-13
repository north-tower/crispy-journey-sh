"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Box,
  Clock,
  Tag,
  ShoppingCart,
  Save,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify"; 


export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<products | null>(null);
  const [loading, setLoading] = useState(true);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarkedPrice, setEditedMarkedPrice] = useState("");
  const [editedSellingPrice, setEditedSellingPrice] = useState("");

  const [editedStock, setEditedStock] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:8900/api/products/${productId}`
        );
        const data = response.data;

        const updatedProduct = {
          ...data,
          status:
          data.stock >= 10
            ? "in_stock"
            : data.stock >= 0 && data.stock <= 10
            ? "low_stock"
            : "out_of_stock",
        };

        setProduct(updatedProduct);
        setEditedSellingPrice(data.sellingPrice);
        setEditedMarkedPrice(data.markedPrice);

        setEditedStock(data.stock);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        router.push("/products");
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleSave = async () => {
    if (!product) return;

    try {
      const updatedProduct = { ...product, sellingPrice: editedSellingPrice, stock: editedStock , markedPrice: editedMarkedPrice};
      await apiClient.patch(`http://localhost:8900/api/products/${product.id}`, {
        sellingPrice: editedSellingPrice,
        markedPrice: editedMarkedPrice,
        stock: editedStock,
      });

      setProduct(updatedProduct);
      setIsEditing(false);
      toast.success("Product edited successfully!");

    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
  
    try {
      await apiClient.patch(`http://localhost:8900/api/products/${product.id}/soft-delete`);
      toast.success("Product deleted successfully!");
      router.push("/products"); // Redirect back to the products list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product.");
    }
  };
  

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-lg bg-muted"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-20 w-full bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) return null;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-7xl mx-auto"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="space-y-4">
            <div className="aspect-square rounded-lg border border-border overflow-hidden group relative">
              <img
                src={`http://localhost:8900/uploads/${product.images?.[0]?.filename}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-md hover:bg-red-50 text-red-500 transition-colors" onClick={handleDelete}>
                  <Trash2 className="h-5 w-5" />
                </button>
                  </>
                  
                  
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Marked Price</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedMarkedPrice}
                      onChange={(e) => setEditedMarkedPrice(e.target.value)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    <p className="font-medium">KES{product.markedPrice}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedSellingPrice}
                      onChange={(e) => setEditedSellingPrice(e.target.value)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    <p className="font-medium">KES{product.sellingPrice}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Box className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedStock}
                      onChange={(e) => setEditedStock(e.target.value)}
                      className="p-1 border rounded"
                    />
                  ) : (
                    <p className="font-medium">{product.stock} units</p>
                  )}
                </div>
                
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.categoryName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      product.status === "in_stock"
                        ? "bg-green-100 text-green-800"
                        : product.status === "low_stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
