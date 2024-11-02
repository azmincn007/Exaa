import React, { useState, useEffect } from 'react';

const ChatMessages = ({ chats, userId }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const receiverName = chats?.data?.adChatReceiver?.name;
  const isBuyerReceiver = chats?.data?.adChatReceiver?.type === 'buyer';

  // Loading state
  if (!chats?.data) {
    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
        {/* Loading skeleton UI */}
      </div>
    );
  }

  useEffect(() => {
    const confirmedMessages = chats.data.messages.filter(
      message => message.status !== 'sending'
    );
    setDisplayedMessages(confirmedMessages);
  }, [chats.data.messages]);

  const MessageBubble = ({ message, isMessageFromReceiver }) => {
    if (!message) return null;

    return (
      <div className={`flex ${isMessageFromReceiver ? 'justify-start' : 'justify-end'}`}>
        <div className={`relative group max-w-[70%] rounded-lg p-3 
          ${isMessageFromReceiver ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'}
          ${message.status === 'sending' ? 'opacity-70' : 'opacity-100'}`}>
          {message.message}
          {message.status === 'sending' && (
            <div className="absolute -bottom-6 right-0 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          {message.status === 'error' && (
            <div className="absolute -bottom-6 right-0 text-xs text-red-500">Failed to send</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="flex-none flex justify-between items-center px-4 py-2 bg-gray-100 rounded-t-lg">
        <p className="text-gray-700 font-semibold">{receiverName}</p>
        <p className="text-gray-500">Today</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-4">
          {chats.data.messages.map((message, index) => {
            const isSenderBuyer = message.adBuyer && !message.adSeller;
            const isMessageFromReceiver = isBuyerReceiver ? isSenderBuyer : !isSenderBuyer;

            // Determine ownership before rendering
            const isUserMessage = message.adBuyer === false && message.adSeller === true;

            return (
              <MessageBubble
                key={message.tempId || message.id || index}
                message={message}
                isMessageFromReceiver={isUserMessage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
