import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const ChatMessages = ({ chats }) => {
  const receiverName = chats.data.adChatReceiver.name;
  const isBuyerReceiver = chats.data.adChatReceiver.type === 'buyer';
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats.data.messages]);

  const MessageBubble = ({ message, isMessageFromReceiver }) => {
    return (
      <div
        className={`flex ${isMessageFromReceiver ? 'justify-start' : 'justify-end'}
          transform transition-all duration-300 ease-out
          ${message.status === 'sending' ? 'opacity-70' : 'opacity-100'}
          translate-y-0`}
      >
        <div
          className={`
            relative group
            max-w-[70%] rounded-lg p-3 
            ${isMessageFromReceiver ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'}
            ${message.status === 'sending' ? 'animate-pulse' : 'animate-none'}
            ${message.status === 'error' ? 'border border-red-500' : ''}
            transform transition-all duration-300
            translate-y-0 opacity-100
            ${message.tempId ? 'animate-messageAppear' : ''}
          `}
        >
          {message.message}
          
          {/* Sending indicator */}
          {message.status === 'sending' && (
            <div className="absolute -bottom-6 right-0 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" 
                   style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" 
                   style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" 
                   style={{ animationDelay: '300ms' }} />
            </div>
          )}
          
          {/* Error indicator */}
          {message.status === 'error' && (
            <div className="absolute -bottom-6 right-0 text-xs text-red-500">
              Failed to send
            </div>
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

            return (
              <MessageBubble
                key={message.tempId || index}
                message={message}
                isMessageFromReceiver={isMessageFromReceiver}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
export default ChatMessages