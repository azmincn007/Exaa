import React from 'react';

const SkeletonChatListItem = () => (
  <div className="flex border-2 rounded-lg overflow-hidden animate-pulse">
    <div className="w-1/2 h-40 bg-gray-300"></div>
    <div className="w-1/2 p-4 h-40 flex flex-col justify-around">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const SkeletonChatList = () => (
  <div className="space-y-4 p-4">
    {[...Array(5)].map((_, index) => (
      <SkeletonChatListItem key={index} />
    ))}
  </div>
);

const SkeletonChatDetails = () => (
  <div className="flex flex-col h-full bg-[#0071BC1A] p-2 gap-4 animate-pulse">
    <div className="bg-gray-300 h-20 rounded-md"></div>
    <div className="bg-gray-300 h-10 rounded-md"></div>
    <div className="flex-1 bg-white rounded-md">
      <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mt-4"></div>
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-10 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
    <div className="bg-gray-300 h-12 rounded-full"></div>
  </div>
);

export { SkeletonChatListItem, SkeletonChatList, SkeletonChatDetails };