import React from 'react';

const PackagesAndOrders = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Packages and Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Packages</h2>
          {/* Add package list here */}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
          {/* Add order list here */}
        </div>
      </div>
    </div>
  );
};

export default PackagesAndOrders;