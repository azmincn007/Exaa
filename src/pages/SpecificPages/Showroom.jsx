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

// Updated fetchShowrooms function to include token if logged in
const fetchShowrooms = async ({ selectedDistrict, selectedTown, searchText }) => {
  const token = localStorage.getItem('UserToken'); // Assuming the token is stored in local storage
  const response = await axios.get(`${BASE_URL}/api/find-other-ad-showrooms`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined, // Include token if available
    },
    params: {
      locationTownId: selectedTown === "all" ? '"all"' : String(selectedTown),
      locationDistrictId: selectedDistrict === "all" ? '"all"' : String(selectedDistrict),
      search: searchText,
      sort: ''
    }
  });
  console.log(response.data.data);
  return response.data.data;
};

// Updated fetchCategories function to include token if logged in
const fetchCategories = async () => {
  const token = localStorage.getItem('UserToken'); // Assuming the token is stored in local storage
  const response = await axios.get(`${BASE_URL}/api/find-showroom-categories`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined, // Include token if available
    }
  });
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
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory === 'all' ? 'all' : Number(initialCategory)
  );
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedTown] = useContext(TownContext);
  const [selectedDistrict] = useContext(DistrictContext);
  const { searchText } = useSearch(); // Correctly destructured



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

  useEffect(() => {
    // Update the selectedCategory state based on the URL parameter
    const categoryFromParams = queryParams.get('category') || 'all';
    setSelectedCategory(categoryFromParams === 'all' ? 'all' : Number(categoryFromParams));
  }, [location.search]); // Listen for changes in the URL parameters

  useEffect(() => {
    // Update the URL parameters when selectedCategory changes
    navigate(`?category=${selectedCategory}`, { replace: true });
  }, [selectedCategory, navigate]);

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

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = window.innerWidth < 640 ? 8 : 16; // Adjusted for small devices

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredShowrooms?.length / CARDS_PER_PAGE);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get the current items to display based on the current page
  const currentItems = filteredShowrooms?.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

  // New pagination component
  const renderPagination = () => {
    return (
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            colorScheme={currentPage === index + 1 ? "blue" : "gray"}
            size="sm"
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-[80%] mx-auto p-2 sm:p-4 font-Inter">
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
                setSelectedCategory(value); // This will trigger the useEffect above
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
          : currentItems?.length > 0
            ? currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0071BC26] rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleShowroomClick(item.id)}
                >
                  <img src={`${BASE_URL}${item.images.url}`} alt="" className='p-1 sm:p-2 w-full h-32 sm:h-48 object-cover' />
                  <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
                    <h3 className="font-bold text-14 sm:text-16">{item.name}</h3>
                    <p className="text-10 sm:text-12 text-gray-600">Location: {item.locationTown?.name}</p>
                    <p className="text-10 sm:text-12 text-gray-600">Total Ads: {item.adCount}</p>
                  </div>
                </div>
              ))
            : <NoAdsMessage />
        }
      </div>

      {/* Render Pagination */}
      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default Showroom;