import React, { useState } from 'react';
import { FaTelegram } from "react-icons/fa";
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

const ChatInput = ({ adId, adCategoryId, adBuyerId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const userToken = localStorage.getItem('UserToken');

    // Create the message object immediately
    const sentMessage = {
      message: message.trim(),
      status: 'sending',
      adBuyer: false,
      adSeller: true,
      tempId: Date.now(),
    };

    // Update the message list immediately
    onMessageSent(sentMessage);
    setMessage(''); // Clear the input after sending

    try {
      setIsSending(true);

      // Send the message to the API
      const response = await axios.post(
        `${BASE_URL}/api/ad-chats`,
        {
          adId,
          adCategoryId,
          adBuyerId,
          message: sentMessage.message,
          isOfferMessage: 'false',
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // Here you can update the message status based on the response
      const confirmedMessage = {
        ...sentMessage,
        id: response.data.id, // Assuming your API returns the message ID
        status: 'sent', // Change status to 'sent'
      };

      onMessageSent(confirmedMessage); // Update the message list with the confirmed message

    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally handle the error state here if needed
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
    <div className="p-4 bg-white flex gap-2  items-center">
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
        className={`transform transition-all duration-200 ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
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
