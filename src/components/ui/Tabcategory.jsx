import React from 'react';
import { Tab, TabList, Tabs, Skeleton } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { BASE_URL } from '../../config/config';

const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/api/ad-categories`);
  return response.data.data;
};

function Tabcategory() {
  const { data, isLoading, isError, error } = useQuery('categories', fetchCategories);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const limitedData = data ? data.slice(0, 8) : [];

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
                      className="min-w-fit text-2xs sm:text-xs md:text-sm whitespace-nowrap px-2 py-1"
                      _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}
                      _focus={{ boxShadow: 'none' }}
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