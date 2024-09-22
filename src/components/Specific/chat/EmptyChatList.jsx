import { Users } from "lucide-react";

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

  export default EmptyChatList