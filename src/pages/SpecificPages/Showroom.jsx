import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button, Select, Skeleton, Box } from '@chakra-ui/react';
import { BiLocationPlus } from 'react-icons/bi';
import { BASE_URL } from '../../config/config';
import { MapPin, ShoppingBag } from 'lucide-react';
import { RiGhostLine } from 'react-icons/ri';
import { FaChevronRight } from 'react-icons/fa6';
import { DistrictContext, TownContext } from '../../App';
import { useSearch } from '../../Hooks/SearchContext';

// Updated fetchShowrooms function without token
const fetchShowrooms = async ({ selectedDistrict, selectedTown, searchText }) => {
  const response = await axios.get(`${BASE_URL}/api/find-other-ad-showrooms`, {
    params: {
      locationTownId: selectedTown === "all" ? '"all"' : String(selectedTown),
      locationDistrictId: selectedDistrict === "all" ? '"all"' : String(selectedDistrict),
      search: searchText,
      sort: ''
    }
  });
  return response.data.data;
};

// Updated fetchCategories function without token
const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/api/find-showroom-categories`);
  return response.data.data;
};

// Skeleton for Showroom Cards
const ShowroomSkeleton = () => (
  <Box className="bg-[#0071BC26] rounded-lg shadow-md overflow-hidden">
    <Skeleton height="150px" />
    <Box p={3}>
      <Skeleton height="16px" width="80%" mb={2} />
      <Skeleton height="14px" width="60%" mb={2} />
      <Skeleton height="14px" width="40%" />
    </Box>
  </Box>
);

// Skeleton for Category Select
const CategorySkeleton = () => (
  <Skeleton height="40px" width="160px" borderRadius="md" />
);

const Showroom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory === 'all' ? 'all' : Number(initialCategory)
  );
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedTown] = useContext(TownContext);
  const [selectedDistrict] = useContext(DistrictContext);

  const { searchText } = useSearch();
  console.log(searchText);

  // Updated useQuery hook for showrooms
  const { data: showrooms, isLoading: isShowroomsLoading } = useQuery(
    ['showrooms', selectedDistrict, selectedTown, searchText],
    () => fetchShowrooms({ selectedDistrict, selectedTown, searchText }),
    {
      enabled: !!selectedDistrict && !!selectedTown,
    }
  );
  const { data: categories, isLoading: isCategoriesLoading } = useQuery('categories', fetchCategories);

  const storedTownName = localStorage.getItem('selectedTownName');

  useEffect(() => {
    console.log('Selected Category:', selectedCategory);
  }, [selectedCategory]);

  const handleShowroomClick = (id) => {
    navigate(`/showroom/${id}`);
  };

  const loadMore = () => {
    setVisibleItems(prevItems => prevItems + 12);
  };

  // Filter showrooms by category
  const filteredShowrooms = showrooms?.filter(showroom => 
    selectedCategory === 'all' || showroom.adCategory?.id === parseInt(selectedCategory)
  );

  // New component for displaying "No ads" message
  const NoAdsMessage = () => (
    <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
      <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Ads to Show</h3>
      <p className="text-gray-500 text-center">There are no showrooms available for the selected category.</p>
    </div>
  );

  return (
    <div className="container mx-auto p-2 sm:p-4 font-Inter">
      {/* Header with Select and Location */}
      <div className='flex flex-col sm:flex-row justify-between py-2 space-y-2 sm:space-y-0'>
        <h2 className='font-semibold text-16 sm:text-18'>Showroom</h2>
        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
          {/* Category Select - Show loading if categories are loading */}
          {isCategoriesLoading ? (
            <CategorySkeleton />
          ) : (
            <Select
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setSelectedCategory(value);
                navigate(`?category=${value}`, { replace: true });
              }}
              className='bg-[#D2BA8580] text-sm'
              size="sm"
            >
              <option value="all">All Categories</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Select>
          )}

          
        </div>
      </div>

      {/* Showrooms Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {isShowroomsLoading
          ? Array.from({ length: 12 }).map((_, idx) => <ShowroomSkeleton key={idx} />)
          : filteredShowrooms?.length > 0
            ? filteredShowrooms.slice(0, visibleItems).map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0071BC26] rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleShowroomClick(item.id)}
                >
                  <img src={`${BASE_URL}${item.images.url}`} alt="" className='p-1 sm:p-2 w-full h-32 sm:h-48 object-cover' />
                  <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
                    <h3 className="font-bold text-14 sm:text-16">{item.name}</h3>
                    <p className="text-10 sm:text-12 text-gray-600">Category: {item.adShowroomCategory.name}</p>
                    <p className="text-10 sm:text-12 text-gray-600">Created On: {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            : <NoAdsMessage />
        }
      </div>

      {/* Load More Button */}
      {filteredShowrooms && filteredShowrooms.length > visibleItems && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={loadMore}
            className='bg-[#0071BC] text-white px-4  flex gap-4 font-Inter font-400 rounded-lg'
            size="sm"
          >
            <span className='text-12'>See all</span> <FaChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Showroom;