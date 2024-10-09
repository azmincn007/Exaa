import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Phone, MoreVertical, MessageCircle, Users, Menu } from 'lucide-react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../config/config';
import { FaTelegram } from 'react-icons/fa';
import NoChatSelected from '../../components/Specific/chat/NoChatSelected';
import ChatMessages from '../../components/Specific/chat/chatmessages';
import TabNavigation from '../../components/Specific/chat/TabNavigation';
import { SkeletonChatDetails, SkeletonChatList } from '../../components/Skelton/chatsection';
import EmptyChatList from '../../components/Specific/chat/EmptyChatList';
import ChatInfo from '../../components/Specific/chat/ChatInfo';
import ChatInput from '../../components/Specific/chat/ChatInput';
import ChatHeader from '../../components/Specific/chat/ChatHeader';
import ChatListItem from '../../components/Specific/chat/ChatListitem';

const ChatComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChat, setSelectedChat] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchChats = async () => {
    const userToken = localStorage.getItem('UserToken');
    let endpoint = `${BASE_URL}/api/find-user-all-chats`;
    if (activeTab === 'buying') {
      endpoint = `${BASE_URL}/api/find-user-buy-chats`;
    } else if (activeTab === 'selling') {
      endpoint = `${BASE_URL}/api/find-user-sell-chats`;
    }
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    return response.data.data;
  };

  const { data: chats, isLoading, error, refetch } = useQuery(['chats', activeTab], fetchChats, {
    onError: (error) => console.error('Error fetching chats:', error),
  });
  
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedChat(null);
    navigate(`/chats/${tab}`);
  }, [navigate]);

  useEffect(() => {
    const currentTab = location.pathname.split('/').pop();
    if (['all', 'buying', 'selling'].includes(currentTab)) {
      setActiveTab(currentTab);
    } else {
      navigate('/chats/all');
    }
    
    const selectedChatId = location.state?.selectedChatId;
    const isNewChat = location.state?.isNewChat;

    if (selectedChatId) {
      if (isNewChat) {
        refetch().then(() => {
          const newChat = chats?.find(c => c.id === selectedChatId);
          if (newChat) {
            setSelectedChat(newChat);
            setActiveTab(newChat.type);
          }
        });
      } else {
        const chat = chats?.find(c => c.ad.id === selectedChatId);
        if (chat) {
          setSelectedChat(chat);
          setActiveTab(chat.type);
        }
      }
    }
  }, [location, navigate, chats, refetch]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full md:w-[90%] mx-auto">
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 overflow-hidden my-8">
        {/* Mobile header */}
        <div className="md:hidden absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-[#0071BC] z-10">
          <Menu onClick={toggleDrawer} className="text-white cursor-pointer" />
          <h1 className="text-white font-semibold">Chats</h1>
        </div>
        
        {/* Chat list for desktop */}
        <div className="hidden md:block w-1/3 border-r border-gray-300 overflow-y-auto bg-[#0071BC1A]">
          <ChatList
            chats={chats}
            isLoading={isLoading}
            activeTab={activeTab}
            onSelectChat={setSelectedChat}
            selectedChatId={selectedChat?.id}
          />
        </div>
        
        {/* Chat list drawer for mobile */}
        <div className={`md:hidden fixed inset-y-0 left-0 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} w-[50%] min-w-[300px] bg-white transition-transform duration-300 ease-in-out z-20`}>
          <div className="h-full flex flex-col pt-16">
            <div className="p-4 bg-[#0071BC] text-white flex justify-between items-center">
              <h2 className="font-semibold">Chat List</h2>
              <button onClick={toggleDrawer} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#0071BC1A]">
              <ChatList
                chats={chats}
                isLoading={isLoading}
                activeTab={activeTab}
                onSelectChat={(chat) => {
                  setSelectedChat(chat);
                  setIsDrawerOpen(false);
                }}
                selectedChatId={selectedChat?.id}
              />
            </div>
          </div>
        </div>
        
        {/* Chat details */}
        <div className="flex-1 md:w-2/3">
          <ChatDetailsContainer selectedChat={selectedChat} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ chats, isLoading, activeTab, onSelectChat, selectedChatId }) => {
  if (isLoading) {
    return <SkeletonChatList />;
  }

  if (!chats || chats.length === 0) {
    return <EmptyChatList activeTab={activeTab} />;
  }

  return (
    <div className="space-y-4 p-4">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={chat.id === selectedChatId}
          onSelect={() => onSelectChat(chat)}
        />
      ))}
    </div>
  );
};



const ChatDetailsContainer = ({ selectedChat, isLoading }) => (
  <div className="w-full h-full flex flex-col">
    {isLoading ? (
      <SkeletonChatDetails />
    ) : selectedChat ? (
      <ChatDetails chat={selectedChat} />
    ) : (
      <NoChatSelected />
    )}
  </div>
);

const ChatDetails = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChatDetails = async () => {
    try {
      const userToken = localStorage.getItem('UserToken');
      const response = await axios.get(
        `${BASE_URL}/api/find-one-chat/${chat.ad.id}/${chat.adCategory.id}/${chat.adBuyer.id}/${chat.adSeller.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      
      setChatDetails(response.data);
    } catch (error) {
      console.error('Error fetching chat details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chat) {
      setLoading(true);
      fetchChatDetails();
    }
  }, [chat]);

  // Handle immediate message updates
  const handleMessageSent = async (newMessage) => {
    if (chatDetails && chatDetails.data) {
      // Create a temporary message object
      const tempMessage = {
        message: newMessage.message || message,
        adBuyer: chat.adBuyer,
        adSeller: chat.adSeller,
        createdAt: new Date().toISOString(),
      };

      // Update the local state immediately
      setChatDetails(prevDetails => ({
        ...prevDetails,
        data: {
          ...prevDetails.data,
          messages: [...prevDetails.data.messages, tempMessage]
        }
      }));

      // Fetch the updated chat details to ensure synchronization
      await fetchChatDetails();
    }
  };

  if (loading) {
    return <SkeletonChatDetails />;
  }
  
  if (!chatDetails) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Failed to load chat details
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#0071BC1A]">
      <div className="flex-none p-2">
        <ChatHeader chat={chat} />
      </div>
      
      <div className="flex-none p-2">
        <ChatInfo chat={chat} />
      </div>
      
      <div className="flex-1 min-h-0 p-2 overflow-hidden">
        <ChatMessages chats={chatDetails} />
      </div>
      
      <div className="flex-none">
        <ChatInput
          message={message}
          setMessage={setMessage}
          adId={chat?.ad.id}
          adCategoryId={chat.adCategory.id}
          adBuyerId={chat.adBuyer.id}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};



export default ChatComponent;