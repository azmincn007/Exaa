import React from 'react'
import { FiPackage, FiShoppingBag, FiHelpCircle, FiSettings, FiLogOut } from 'react-icons/fi'

const ProfileDropdown = ({ onLogout,onShowPackagesAndOrders  }) => (
  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-30">
    <div className="px-4 py-2 border-b border-gray-200">
      <div className="flex items-center">
        <img src="https://via.placeholder.com/40" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-gray-800">Eliana Elissa</p>
          <p className="text-sm text-gray-600">Kochi, Kakkanad</p>
        </div>
      </div>
    </div>
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
      View and Edit Profile
    </button>
    <button 
      onClick={onShowPackagesAndOrders}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white bg-[#0071BC66]"
    >
      <FiPackage className="inline mr-2" /> Buy Packages & My Orders
    </button>
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
      <FiShoppingBag className="inline mr-2" /> My Showroom
    </button>
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
      <FiHelpCircle className="inline mr-2" /> Help & Support
    </button>
    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
      <FiSettings className="inline mr-2" /> Settings
    </button>
    <button
      onClick={onLogout}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
    >
      <FiLogOut className="inline mr-2" /> Logout
    </button>
  </div>
)

export default ProfileDropdown