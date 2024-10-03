import React from 'react';
import { BASE_URL } from '../../../config/config';

const ChatListItem = ({ chat, isSelected, onSelect }) => {
  console.log(chat?.adSeller.profileImage?.url);
  
  const isMobile = window.innerWidth <= 768; // Simple mobile detection

  return (
    <div
      className={`flex border-2 cursor-pointer hover:bg-gray-100 rounded-lg overflow-hidden ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'border-black'
      }`}
      onClick={onSelect}
    >
      {isMobile ? (
        // Mobile layout
        <div className="flex items-center w-full p-2">
          <img 
            src={`${BASE_URL}${chat?.adSeller.profileImage?.url}`} 
            alt={chat.adSeller.name} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">{chat?.adSeller.name}</h3>
            <p className="text-xs text-gray-600 truncate">{chat?.ad?.title}</p>
            <p className="text-xs text-gray-500 truncate">{chat?.adCategory.name}</p>
          </div>
        </div>
      ) : (
        // Desktop layout
        <>
          <div className="w-1/2 h-40 overflow-hidden p-2">
            <img 
              src={`${BASE_URL}${chat?.adSeller?.profileImage?.url}`} 
              alt={chat.adSeller.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-1/2 p-4 h-40 flex flex-col justify-around">
            <h3 className="font-semibold truncate">{chat?.adSeller.name}</h3>
            <div className='flex flex-col gap-2'>
              <p className="text-sm text-gray-600 truncate">{chat?.ad?.title}</p>
              <p className="text-sm text-gray-500 truncate">{chat?.adCategory.name}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatListItem;