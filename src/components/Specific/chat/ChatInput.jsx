// ChatInput.jsx
import React, { useState } from 'react';
import { FaTelegram } from "react-icons/fa";
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

const ChatInput = ({ message, setMessage, adId, adCategoryId, adBuyerId, onMessageSent }) => {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const tempMessage = {
      message: message.trim(),
      status: 'sending',
      tempId: Date.now(),
      timestamp: new Date().toISOString()
    };

    try {
      setIsSending(true);
      // Clear input immediately
      setMessage('');
      // Add temporary message to chat
      onMessageSent(tempMessage);
      
      const userToken = localStorage.getItem('UserToken');
      const response = await axios.post(
        `${BASE_URL}/api/ad-chats`,
        {
          adId,
          adCategoryId,
          adBuyerId,
          message: tempMessage.message
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Update with real message data
      onMessageSent({
        ...response.data,
        tempId: tempMessage.tempId,
        status: 'sent'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      onMessageSent({
        ...tempMessage,
        status: 'error'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white flex gap-2 m-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Send a message"
        disabled={isSending}
        className="bg-[#0071BC1A] rounded-full flex-1 border px-4 py-2 focus:outline-none disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isSending || !message.trim()}
        className={`transform transition-all duration-200 ${
          isSending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
        }`}
      >
        <FaTelegram 
          size={30} 
          className={`text-blue-500 ${isSending ? 'animate-pulse' : 'hover:text-blue-600'}`}
        />
      </button>
    </div>
  );
};

export default ChatInput;