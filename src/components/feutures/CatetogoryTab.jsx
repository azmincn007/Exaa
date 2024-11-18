import React, { useState } from 'react';
import Tabcategory from '../ui/Tabcategory';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import CategoryModal from '../modals/othermodals/CategoryModal';
import { useSearch } from '../../Hooks/SearchContext';

function CategoryTab() {
  const [isOpen, setIsOpen] = useState(false);
  const { setHasSearched, resetSearch } = useSearch();

  const toggleOpen = () => {
    resetSearch();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-exagrey relative shadow-md ">
      <div className="w-full h-4 absolute bottom-0 left-0 shadow-custom"></div>
      <div className="w-full px-4 md:w-[90%] lg:w-[80%] mx-auto flex flex-row items-center relative z-5 py-2">
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
      <CategoryModal isOpen={isOpen} onClose={toggleOpen} />
    </div>
  );
}

export default CategoryTab;