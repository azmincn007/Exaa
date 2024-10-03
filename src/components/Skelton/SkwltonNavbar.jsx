import React from 'react';
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";

function SkeletonNavbar() {
  return (
    <nav className="bg-exablack text-white">
      <div className="w-[90%] mx-auto py-4">
        {/* Large screens layout (above 900px) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2 lg:col-span-1">
            <Skeleton height="40px" width="120px" />
          </div>
          <div className="col-span-4">
            <Skeleton height="40px" />
          </div>
          <div className="col-span-3 flex gap-2 items-center justify-around">
            <Skeleton height="30px" width="120px" />
            <Skeleton height="30px" width="120px" />
          </div>
          <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center">
            <div className="flex justify-between items-center space-x-2">
              {[...Array(4)].map((_, index) => (
                <SkeletonCircle key={index} size="10" />
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Skeleton height="40px" />
          </div>
        </div>
        
        {/* Small screens and tablet layout (below 900px) */}
        <div className="lg:hidden flex flex-col space-y-4">
          <div className="flex justify-end items-center mb-2">
            <Skeleton height="30px" width="120px" />
            <Skeleton height="30px" width="120px" marginLeft="8px" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton height="30px" width="120px" />
            <div className="flex items-center space-x-1">
              {[...Array(4)].map((_, index) => (
                <SkeletonCircle key={index} size="8" />
              ))}
              <Skeleton height="32px" width="60px" />
            </div>
          </div>
          <div className="w-full">
            <Skeleton height="40px" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SkeletonNavbar;