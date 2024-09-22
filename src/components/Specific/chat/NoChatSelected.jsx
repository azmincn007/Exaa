import React from 'react';
import { MessageCircle } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-100">
      <MessageCircle size={64} className="text-blue-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
      <p className="text-center max-w-md">
        Select a chat from the list on the left to view your conversation.
        Start connecting with buyers and sellers!
      </p>
    </div>
  );
};

export default NoChatSelected;