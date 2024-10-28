import React from "react";

export function StoreInfo() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Store Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-2">Store Name</label>
          <input
            type="text"
            defaultValue="My Awesome Store"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2">Store URL</label>
          <div className="flex">
            <span
              className="inline-flex items-center px-3 bg-gray-50 border border-r-0 
              border-gray-200 rounded-l-xl text-gray-500"
            >
              https://
            </span>
            <input
              type="text"
              defaultValue="mystore.shopeazz.com"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-r-xl focus:outline-none 
                focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
