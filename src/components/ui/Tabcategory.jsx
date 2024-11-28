import React, { useState } from 'react';
import { Tab, TabList, Tabs, Skeleton } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { BASE_URL } from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../Hooks/SearchContext';

const fetchCategories = async (isFromShowroom) => {
  try {
    const response = await axios.get(`${BASE_URL}${isFromShowroom ? '/api/find-showroom-categories' : '/api/ad-categories'}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to handle it in the component
  }
};

function Tabcategory({isFromShowroom}) {
  const { setHasSearched, resetSearch } = useSearch();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(['categories', isFromShowroom], () => fetchCategories(isFromShowroom));
  const [activeTab, setActiveTab] = useState(null);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const limitedData = data ? data : [];

  const handleCategoryClick = (categoryId, categoryName) => {
    setActiveTab(categoryId);
    if (isFromShowroom) {
      resetSearch();
      navigate(`/showroom?category=${categoryId}`);
    } else {
      resetSearch();
      navigate(`/category/${categoryId}/${categoryName}`);
    }
  };

  const allCategories = [
    ...(limitedData || [])
  ];

  return (
    <div className="w-full">
      <Tabs variant="unstyled">
        <Swiper
          slidesPerView="auto"
          spaceBetween={10}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
        >
          <TabList className="flex" borderBottom="none">
            {isLoading
              ? Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <SwiperSlide key={index} style={{ width: 'auto' }}>
                      <Tab className="min-w-fit" _focus={{ boxShadow: 'none' }}>
                        <Skeleton height="16px" width="60px" />
                      </Tab>
                    </SwiperSlide>
                  ))
              : limitedData.map((category) => (
                  <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                    <Tab
                      className={`min-w-fit text-2xs sm:text-xs md:text-sm whitespace-nowrap px-2 py-1 ${
                        activeTab === category.id ? 'text-blue-500 border-b-2 border-blue-500' : ''
                      }`}
                      _focus={{ boxShadow: 'none' }}
                      onClick={() => handleCategoryClick(category.id, category.name)}  
                    >
                      {category.name}
                    </Tab>
                  </SwiperSlide>
                ))}
          </TabList>
        </Swiper>
      </Tabs>
    </div>
  );
}

export default Tabcategory;
