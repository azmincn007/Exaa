import React, { useContext } from 'react';
import { FiPackage, FiShoppingBag, FiHelpCircle, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/config';
import { MdFavoriteBorder } from 'react-icons/md';
import { UserdataContext } from '../../../App';

const ProfileDropdown = ({ onLogout }) => {
  const navigate = useNavigate();
  const { userData, isLoading } = useContext(UserdataContext);

  const renderProfileImage = () => {
    if (userData?.profileImage?.url) {
      return (
        <img
          src={`${BASE_URL}${userData.profileImage.url}`}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
          <FiUser className="text-gray-500 text-xl" />
        </div>
      );
    }
  };

  const menuItems = [
    { label: 'Buy Packages & My Orders', icon: FiPackage, onClick: () => navigate('/buy-packages/myorders'), className: 'bg-[#0071BC66]' },
    { label: 'Bought Packages & Billings', icon: FiPackage, onClick: () => navigate('/packages-and-orders/packages') },
    { label: 'Favourites', icon: MdFavoriteBorder, onClick: () => navigate('/my-ads') },
    { label: 'My Showroom', icon: FiShoppingBag, onClick: () => navigate('/my-showroom') },
    { label: 'Help & Support', icon: FiHelpCircle },
    { label: 'Settings', icon: FiSettings },
    { label: 'Logout', icon: FiLogOut, onClick: onLogout },
  ];

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
        <div className='my-2'>
          <button
            onClick={() => navigate('/profile')}
            className="block w-full text-center px-4 py-2 text-sm text-white bg-[#16273C] rounded-md hover:bg-[#0d1b2a] transition-colors"
          >
            View and Edit Profile
          </button>
        </div>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors ${item.className || ''}`}
          >
            <item.icon className="inline mr-2" /> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProfileDropdown;