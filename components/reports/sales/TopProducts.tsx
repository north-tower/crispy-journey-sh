export function TopProducts() {
  const topProducts = [
    {
      id: 1,
      name: "Product Alpha",
      sales: 128,
      revenue: 499.99,
    },
    {
      id: 2,
      name: "Product Beta",
      sales: 98,
      revenue: 399.99,
    },
    {
      id: 3,
      name: "Product Gamma",
      sales: 87,
      revenue: 299.99,
    },
    {
      id: 4,
      name: "Product Delta",
      sales: 76,
      revenue: 199.99,
    },
    {
      id: 5,
      name: "Product Epsilon",
      sales: 65,
      revenue: 149.99,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">{product.sales} sales</p>
            </div>
            <p className="font-medium text-gray-900">
              ${product.revenue.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
