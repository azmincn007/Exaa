import React from 'react';
import { MoreVertical, User } from "lucide-react";
import { BASE_URL } from "../../../config/config";

const ChatHeader = ({ chat }) => {
  const receiver = chat.adChatReceiver;

  return (
    <div className="bg-[#0071BC] text-white p-3 flex justify-between items-center rounded-md md:p-4">
      <div className='flex items-center gap-3 md:gap-4'>
        <div className='rounded-full w-[50px] h-[50px] md:w-[70px] md:h-[70px] overflow-hidden'>
          {receiver?.profileImage?.url ? (
            <img 
              className='w-full h-full object-cover' 
              src={`${BASE_URL}${receiver.profileImage.url}`} 
              alt={receiver.name} 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500" size={30} />
            </div>
          )}
        </div>
        <div className="text-xs md:text-sm">
          <h2 className="font-semibold">{receiver?.name}</h2>
          <p>{receiver?.location || 'Location not available'}</p>
        </div>
      </div>
      <div className='hidden md:flex'>
        <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full bg-white flex justify-center items-center'>
          <MoreVertical className="cursor-pointer text-black" />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
