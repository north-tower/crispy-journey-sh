export function CategoryPerformance() {
  const categories = [
    {
      name: "Electronics",
      products: 842,
      conversion: "3.2%",
      processing: "1.4 days",
      satisfaction: "4.6/5",
    },
    {
      name: "Clothing",
      products: 1253,
      conversion: "3.8%",
      processing: "1.1 days",
      satisfaction: "4.7/5",
    },
    // Add more categories as needed
  ];

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
              <p className="text-sm text-gray-500">
                {category.products} products
              </p>
            </div>
            <div className="flex items-center gap-8">
              <Metric label="Conversion Rate" value={category.conversion} />
              <Metric label="Avg. Processing" value={category.processing} />
              <Metric label="Satisfaction" value={category.satisfaction} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
