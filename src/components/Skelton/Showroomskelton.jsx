import React from 'react';

const ShowroomSingleSkeleton = () => {
  return (
    <div className="w-[80%] mx-auto font-Inter animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
      <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 h-48 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default ShowroomSingleSkeleton;