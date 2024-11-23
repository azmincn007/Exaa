import React, { useState } from 'react';
import Tabcategory from '../ui/Tabcategory';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CategoryModal from '../modals/othermodals/CategoryModal';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../Hooks/SearchContext';

function ShowroomCategoryTab() {
  const [isOpen, setIsOpen] = useState(false);
  const { setHasSearched, resetSearch } = useSearch();

  const navigate = useNavigate();

  const navigateToShowrooms = () => {
    resetSearch();
  navigate('/showroom')
  };

  return (
    <div className="w-full bg-exagrey relative shadow-md ">
      <div className="w-full h-4 absolute bottom-0 left-0 shadow-custom"></div>
      <div className="w-full px-4 md:w-[90%] lg:w-[80%] mx-auto flex flex-row items-center relative z-5 py-2">
        <div
          className="flex-shrink-0 py-2 md:py-0 flex items-center cursor-pointer text-xs sm:text-sm whitespace-nowrap mr-4"
          onClick={navigateToShowrooms}
        >
          <span className="font-semibold text-blue-500 ">All Showrooms</span>
          {isOpen ? (
            <FaChevronUp className="ml-1 sm:ml-2" size={12} />
          ) : (
            <FaChevronDown className="ml-1 sm:ml-2" size={12} />
          )}
        </div>
        <div className="flex-grow overflow-x-auto">
          <Tabcategory isFromShowroom={true} />
        </div>
      </div>
    </div>
  );
}

export default ShowroomCategoryTab;
