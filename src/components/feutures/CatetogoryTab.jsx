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
      <div className="w-[80%] mx-auto grid grid-cols-12 items-center relative z-10">
        <div className="col-span-2 flex items-center cursor-pointer" onClick={toggleOpen}>
          All Category
          {isOpen ? (
            <FaChevronUp className="ml-6" size={20} />
          ) : (
            <FaChevronDown className="ml-6" size={20} />
          )}
        </div>
        <div className="col-span-10">
          <Tabcategory />
        </div>
      </div>
      <CategoryModal isOpen={isOpen} onClose={toggleOpen} categories={categories || []} />
    </div>
  );
}

export default CategoryTab;