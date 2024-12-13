import React, { useEffect, useState } from "react";

export function CategoryPerformance() {
  const [categories, setCategories] = useState([]);

  // Fetch category sales data from the API
  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const response = await fetch("http://localhost:8900/api/dashboard/stats?timeRange=monthly");
        if (!response.ok) {
          throw new Error("Failed to fetch category sales");
        }
        const data = await response.json();

        // Map the API response to the expected format for display
        const formattedCategories = data.categorySales.map((category) => ({
          name: category.categoryName,
          sales: `$${category.sales}`, // Format sales as currency
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching category sales:", error);
      }
    };

    fetchCategorySales();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance by Category
      </h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">Sales: {category.sales}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
