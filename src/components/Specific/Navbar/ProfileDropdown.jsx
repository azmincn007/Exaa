import React from 'react';
import { FiPackage, FiShoppingBag, FiHelpCircle, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/config';
import { FaVolcano } from 'react-icons/fa6';
import { MdFavoriteBorder } from 'react-icons/md';

const ProfileDropdown = ({ onLogout, userData }) => {
  console.log(userData);
  
  const navigate = useNavigate();

  const renderProfileImage = () => {
    if (userData?.profileImage) {
      return (
        <img
          src={`${BASE_URL}${userData.profileImage}`}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
          <FiUser className="text-gray-500" />
        </div>
      );
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-30">
      <div className='w-[90%] mx-auto'>
        <div className="py-2 border-b border-gray-200">
          <div className="flex items-center">
            {renderProfileImage()}
            <div>
              <p className="font-semibold text-gray-800">{userData?.name || 'User'}</p>
              <p className="text-sm text-gray-600">Kochi, Kakkanad</p>
            </div>
          </div>
        </div>
        <div className='mb-[10px]'>
          <button
            onClick={() => navigate('/profile', { state: { userData } })}
            className="block w-full text-center px-4 py-[5px] text-sm text-white bg-[#16273C] rounded-md"
          >
            View and Edit Profile
          </button>
        </div>
        <button onClick={() => navigate('/buy-packages/myorders')} className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white bg-[#0071BC66]">
          <FiPackage className="inline mr-2" /> Buy Packages & My Orders
        </button>
        <button onClick={() => navigate('/packages-and-orders/packages')} className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <FiPackage className="inline mr-2" /> Bought Packages & Billings
        </button>
        <button onClick={() => navigate('/my-ads')} className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <MdFavoriteBorder  className="inline mr-2" /> Favourites
        </button>
        <button onClick={() => navigate('/my-showroom')} className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <FiShoppingBag className="inline mr-2" /> My Showroom
        </button>
        <button className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <FiHelpCircle className="inline mr-2" /> Help & Support
        </button>
        <button className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <FiSettings className="inline mr-2" /> Settings
        </button>
        <button onClick={onLogout} className="block w-full text-left px-4 py-[5px] text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          <FiLogOut className="inline mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileDropdown;