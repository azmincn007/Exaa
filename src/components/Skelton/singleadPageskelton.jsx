import React from 'react';

function SkeletonSingleAdPage() {
  return (
    <div className="my-16 font-Inter animate-pulse">
      {/* Image carousel skeleton */}
      <div className="w-4/5 mx-auto h-[300px] bg-gray-200"></div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Main content skeleton */}
          <div className="col-span-12 md:col-span-8">
            <div className="h-8 bg-gray-200 w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 w-full mb-2"></div>
            <div className="h-4 bg-gray-200 w-full mb-2"></div>
            <div className="h-4 bg-gray-200 w-3/4 mb-4"></div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-10 bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className="bg-gray-200 p-4 h-40"></div>
            <div className="bg-gray-200 p-4 h-20"></div>
          </div>
        </div>

        {/* Description skeleton */}
        <div className="mt-8">
          <div className="h-6 bg-gray-200 w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 w-full mb-2"></div>
          <div className="h-4 bg-gray-200 w-full mb-2"></div>
          <div className="h-4 bg-gray-200 w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonSingleAdPage;