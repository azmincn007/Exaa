import React from 'react';
import { BASE_URL } from '../../../config/config';
import { User } from 'lucide-react';

const ChatListItem = ({ chat, isSelected, onSelect }) => {
  const isMobile = window.innerWidth <= 768; // Simple mobile detection
  const receiver = chat.adChatReceiver;

  const renderAvatar = () => {
    if (receiver?.profileImage?.url) {
      return (
        <img
          src={`${BASE_URL}${receiver.profileImage.url}`}
          alt={receiver.name}
          className={isMobile ? "w-10 h-10 rounded-full" : "w-full h-full object-cover rounded-lg"}
        />
      );
    } else {
      return (
        <div className={`flex items-center justify-center bg-gray-200 ${isMobile ? "w-10 h-10 rounded-full" : "w-full h-full rounded-lg"}`}>
          <User className="text-gray-500" size={isMobile ? 24 : 48} />
        </div>
      );
    }
  };

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
          <div className="mr-3">{renderAvatar()}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">{receiver.name}</h3>
            <p className="text-xs text-gray-600 truncate">{chat?.ad?.title}</p>
            <p className="text-xs text-gray-500 truncate">{chat?.adCategory.name}</p>
          </div>
        </div>
      ) : (
        // Desktop layout
        <>
          <div className="w-1/2 h-40 overflow-hidden p-2">
            {renderAvatar()}
          </div>
          <div className="w-1/2 p-4 h-40 flex flex-col justify-around">
            <h3 className="font-semibold truncate">{receiver.name}</h3>
            <div className='flex flex-col gap-2'>
              <p className="text-sm text-gray-600 truncate">{chat?.ad?.title}</p>
              <p className="text-sm text-gray-500 truncate">{`${chat?.ad.locationTown?.name},${chat?.ad.locationDistrict?.name}`}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatListItem;