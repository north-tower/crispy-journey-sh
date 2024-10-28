export function StoreAddress() {
  const fields = [
    { label: "Street Address", name: "street" },
    { label: "City", name: "city" },
    { label: "State/Province", name: "state" },
    { label: "Postal Code", name: "postal" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Business Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-gray-500 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
                focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
