import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Phone, MoreVertical, MessageCircle, Users } from 'lucide-react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../config/config';
import { FaTelegram } from 'react-icons/fa';

// Skeleton components
const SkeletonChatListItem = () => (
  <div className="flex border-2 rounded-lg overflow-hidden animate-pulse">
    <div className="w-1/2 h-40 bg-gray-300"></div>
    <div className="w-1/2 p-4 h-40 flex flex-col justify-around">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const SkeletonChatList = () => (
  <div className="space-y-4 p-4">
    {[...Array(5)].map((_, index) => (
      <SkeletonChatListItem key={index} />
    ))}
  </div>
);

const SkeletonChatDetails = () => (
  <div className="flex flex-col h-full bg-[#0071BC1A] p-2 gap-4 animate-pulse">
    <div className="bg-gray-300 h-20 rounded-md"></div>
    <div className="bg-gray-300 h-10 rounded-md"></div>
    <div className="flex-1 bg-white rounded-md">
      <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mt-4"></div>
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-10 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
    <div className="bg-gray-300 h-12 rounded-full"></div>
  </div>
);

const ChatComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChat, setSelectedChat] = useState(null);
  
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

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-[90%] mx-auto">
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 overflow-hidden my-8">
        <ChatListContainer
          chats={chats}
          isLoading={isLoading}
          activeTab={activeTab}
          onSelectChat={setSelectedChat}
          selectedChatId={selectedChat?.id}
        />
        <ChatDetailsContainer selectedChat={selectedChat} isLoading={isLoading} />
      </div>
    </div>
  );
};

const TabNavigation = ({ activeTab, onTabChange }) => (
  <div className="flex bg-white">
    {['all', 'buying', 'selling'].map((tab) => (
      <NavLink
        key={tab}
        to={`/chats/${tab}`}
        className={({ isActive }) => `flex-1 py-2 text-center ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}
        onClick={() => onTabChange(tab)}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </NavLink>
    ))}
  </div>
);

const ChatListContainer = ({ chats, isLoading, activeTab, onSelectChat, selectedChatId }) => (
  <div className="w-1/3 border-r border-gray-300 overflow-y-auto bg-[#0071BC1A]">
    {isLoading ? (
      <SkeletonChatList />
    ) : (
      <ChatList 
        chats={chats} 
        onSelectChat={onSelectChat} 
        selectedChatId={selectedChatId}
        activeTab={activeTab}
      />
    )}
  </div>
);

const ChatList = ({ chats, onSelectChat, selectedChatId, activeTab }) => {
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

const EmptyChatList = ({ activeTab }) => (
  <div className="h-full flex flex-col items-center justify-center p-4 text-center">
    <Users size={64} className="text-blue-500 mb-4" />
    <h2 className="text-2xl font-semibold mb-2">No Chats Yet</h2>
    <p className="text-gray-600 mb-4">
      {activeTab === 'buying' 
        ? "Start conversations with sellers to see your chats here." 
        : activeTab === 'selling' 
          ? "Engage with potential buyers to fill this space with chats." 
          : "Connect with buyers or sellers to begin your conversations."}
    </p>
    <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
      {activeTab === 'buying' ? 'Find Sellers' : activeTab === 'selling' ? 'Attract Buyers' : 'Explore Marketplace'}
    </button>
  </div>
);

const ChatListItem = ({ chat, isSelected, onSelect }) => (
  <div
    className={`flex border-2 cursor-pointer hover:bg-gray-100 rounded-lg overflow-hidden ${isSelected ? 'bg-blue-100 border-blue-500' : 'border-black'}`}
    onClick={onSelect}
  >
    <div className="w-1/2 h-40 overflow-hidden p-2">
      <img 
        src={`${BASE_URL}${chat?.adSeller.profileImage.url}`} 
        alt={chat.adSeller.name} 
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div className="w-1/2 p-4 h-40 flex flex-col justify-around">
      <h3 className="font-semibold truncate">{chat?.adSeller.name}</h3>
      <div className='flex flex-col gap-2'>
        <p className="text-sm text-gray-600 truncate">{chat?.ad?.title}</p>
        <p className="text-sm text-gray-500 truncate">hi</p>
      </div>
    </div>
  </div>
);

const ChatDetailsContainer = ({ selectedChat, isLoading }) => (
  <div className="w-2/3 flex flex-col">
    {isLoading ? (
      <SkeletonChatDetails />
    ) : selectedChat ? (
      <ChatDetails chat={selectedChat} />
    ) : (
      <NoChatSelected />
    )}
  </div>
);

const NoChatSelected = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-100">
    <MessageCircle size={64} className="text-blue-500 mb-4" />
    <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
    <p className="text-center max-w-md">
      Select a chat from the list on the left to view your conversation.
      Start connecting with buyers and sellers!
    </p>
  </div>
);

const ChatDetails = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [chatDetails, setChatDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatDetails = async () => {
      setLoading(true);
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
    if (chat) {
      fetchChatDetails();
    }
  }, [chat]);

  const handleSendMessage = () => {
    // Implement send message logic here
    setMessage('');
  };

  if (loading) {
    return <SkeletonChatDetails />;
  }
  
  if (!chatDetails) {
    return <div className="flex-1 flex items-center justify-center">Failed to load chat details</div>;
  }
  
  return (
    <div className="flex flex-col h-full bg-[#0071BC1A] p-2 gap-4">
      <ChatHeader chat={chat} />
      <ChatInfo chat={chat} />
      <ChatMessages />
      <ChatInput message={message} setMessage={setMessage} onSend={handleSendMessage} />
    </div>
  );
};

const ChatHeader = ({ chat }) => (
  <div className="bg-[#0071BC] text-white p-4 flex justify-between items-center rounded-md">
    <div className='flex items-center gap-4'>
      <div className='rounded-full'>
        <img className='rounded-full w-[70px] h-[70px] object-cover' src={`${BASE_URL}${chat.adSeller.profileImage.url}`} alt="" />
      </div>
      <div>
        <h2 className="font-semibold">{chat.adSeller?.name}</h2>
        <p className="text-sm">{chat.adSeller?.location || 'Location not available'}</p>
      </div>
    </div>
    <div className="flex space-x-4">
      <div className='w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center'>
        <Phone className="cursor-pointer text-black" />
      </div>
      <div className='w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center'>
        <MoreVertical className="cursor-pointer text-black" />
      </div>
    </div>
  </div>
);

const ChatInfo = ({ chat }) => (
  <div className='bg-white p-2 flex justify-between text-[#1F1F1F99]'>
    <p>
      <h2 className="font-semibold">{chat.ad?.title}</h2>
    </p>
    <p>price</p>
  </div>
);

const ChatMessages = () => (
  <div className='bg-white flex-1 flex flex-col justify-between'>
    <div className='flex justify-center'> 
      <p>Today</p>
    </div>
    {/* Add message components here */}
  </div>
);

const ChatInput = ({ message, setMessage, onSend }) => (
  <div className="p-4 bg-white flex gap-2 m-2 items-center">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Send a message"
      className="bg-[#0071BC1A] rounded-full flex-1 border px-4 py-2 focus:outline-none"
    />
    <FaTelegram size={30} className="cursor-pointer" onClick={onSend} />
  </div>
);

export default ChatComponent;