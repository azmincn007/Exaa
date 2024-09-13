import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button, Select, Skeleton, Box } from '@chakra-ui/react';
import { BiLocationPlus } from 'react-icons/bi';
import { BASE_URL } from '../../config/config';

const fetchShowrooms = async () => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/find-other-ad-showrooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data.data);
  return response.data.data;
};

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

const Showroom = () => {
  const navigate = useNavigate();
  const { data: showrooms, isLoading, isError, error } = useQuery('showrooms', fetchShowrooms);
  const [visibleItems, setVisibleItems] = useState(12);

  const handleShowroomClick = (id) => {
    navigate(`/showroom/${id}`);
  };

  const loadMore = () => {
    setVisibleItems(prevItems => prevItems + 12);
  };

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const isMobile = window.innerWidth < 640; // SM breakpoint in Tailwind

  return (
    <div className="container mx-auto p-2 sm:p-4 font-Inter">
      <div className='flex flex-col sm:flex-row justify-between py-2 space-y-2 sm:space-y-0'>
        <h2 className='font-semibold text-16 sm:text-18'>Showroom</h2>
        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
          <Select 
            variant='filled' 
            placeholder='Filled' 
            className='bg-[#D2BA8580] text-sm'
            size="sm"
          />
          <Button 
            leftIcon={<BiLocationPlus />} 
            className='bg-[#D2BA8580] px-4 sm:px-12 text-sm' 
            variant='solid'
            size="sm"
          >
            Email
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        {isLoading
          ? Array(8).fill(0).map((_, index) => <ShowroomSkeleton key={index} />)
          : showrooms?.slice(0, visibleItems).map((item) => (
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
        }
      </div>
      {showrooms && showrooms.length > visibleItems && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={loadMore} 
            className='bg-[#0071BC] text-white px-6 py-2'
            size="md"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Showroom;