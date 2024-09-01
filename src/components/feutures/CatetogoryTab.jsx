import React, { useState } from 'react';
import Tabcategory from '../ui/Tabcategory';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import CategoryModal from '../modals/othermodals/CategoryModal';

const fetchCategories = async () => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/ad-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

function CategoryTab() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useQuery('categories', fetchCategories);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-exagrey relative shadow-md">
      <div className="w-full h-4 absolute bottom-0 left-0 shadow-custom"></div>
      <div className="w-full px-4 md:w-[90%] lg:w-[80%] mx-auto flex flex-row items-center relative z-10 py-2">
        <div 
          className="flex-shrink-0 py-2 md:py-0 flex items-center cursor-pointer text-xs sm:text-sm whitespace-nowrap mr-4"
          onClick={toggleOpen}
        >
          <span className="font-medium">All Category</span>
          {isOpen ? (
            <FaChevronUp className="ml-1 sm:ml-2" size={12} />
          ) : (
            <FaChevronDown className="ml-1 sm:ml-2" size={12} />
          )}
        </div>
        <div className="flex-grow overflow-x-auto">
          <Tabcategory />
        </div>
      </div>
      <CategoryModal isOpen={isOpen} onClose={toggleOpen} categories={categories || []} />
    </div>
  );
}

export default CategoryTab;