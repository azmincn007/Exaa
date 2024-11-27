import React, { useState, useEffect } from 'react';

const ChatMessages = ({ chats, userId ,isLoading}) => {
  const displayedMessages = chats?.data?.messages?.filter(
    message => message.status !== 'sending'
  ) || [];

  const receiverName = chats?.data?.adChatReceiver?.name;
  const isBuyerReceiver = chats?.data?.adChatReceiver?.type === 'buyer';
console.log(chats);

  const MessageBubble = ({ message, isMessageFromReceiver }) => {
    if (!message) return null;

    return (
      <div className={`flex ${isMessageFromReceiver ? 'justify-start' : 'justify-end'}`}>
        <div className={`relative group max-w-[70%] rounded-lg p-2  
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

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isNaN(messageDate)) return null; // Return null for invalid dates

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString(); // Return formatted date for other days
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm p-2">
      {isLoading && <p className="text-gray-500">Loading...</p>}
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-4">
          {isLoading ? null : (
            displayedMessages.reduce((acc, message, index) => {
              const messageDate = formatDate(message.createdMessageAt);
              // Check if the last displayed date is different from the current message date
              if (index === 0 || messageDate !== formatDate(displayedMessages[index - 1].createdMessageAt)) {
                acc.push(
                  <p key={`date-${index}`} className="text-xs text-gray-500">{messageDate}</p>
                );
              }

              acc.push(
                <div key={message.tempId || message.id || index}>
                  <MessageBubble
                    message={message}
                    isMessageFromReceiver={message.adBuyer === false && message.adSeller === true}
                  />
                </div>
              );

              return acc;
            }, [])
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
