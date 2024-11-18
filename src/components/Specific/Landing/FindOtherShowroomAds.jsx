import React, { useState } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { useQuery } from 'react-query';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import CardUser from '../../common/Cards/CardUser';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Button } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';

const fetchOtherShowrooms = async ({ adShowroomId, adId, adCategoryId }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/find-showroom-other-ads/${adShowroomId}?adId=${adId}&adCategoryId=${adCategoryId}`
    );
    return data.data;
  } catch (error) {
    console.error('Error fetching other showrooms:', error);
    throw error;
  }
};

const FindOtherShowrooms = ({ adId, adCategoryId, adShowroomId }) => {
  const [visibleCards, setVisibleCards] = useState({
    md: 2,
    lg: 3,
    xl: 4
  });

  const { data: otherShowrooms, isLoading, error } = useQuery(
    ['otherShowrooms', adShowroomId, adId, adCategoryId],
    () => fetchOtherShowrooms({ adShowroomId, adId, adCategoryId }),
    {
      enabled: !!adShowroomId && !!adId && !!adCategoryId,
      retry: 2,
    }
  );

  const handleShowMore = (breakpoint) => {
    setVisibleCards(prev => ({
      ...prev,
      [breakpoint]: prev[breakpoint] + (breakpoint === 'xl' ? 4 : (breakpoint === 'lg' ? 3 : 2))
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Other Showrooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in FindOtherShowrooms:', error);
    return null;
  }

  if (!otherShowrooms?.length) {
    return null;
  }

  const formatPostedDate = (date) => {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  const getCurrentVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return visibleCards.xl;
      if (window.innerWidth >= 1024) return visibleCards.lg;
      return visibleCards.md;
    }
    return visibleCards.md;
  };

  const renderShowMoreButton = (breakpoint) => {
    const totalShowrooms = otherShowrooms.length;
    const currentVisible = visibleCards[breakpoint];
    
    if (totalShowrooms > currentVisible) {
      return (
        <div className={`hidden ${breakpoint === 'md' ? 'md:block lg:hidden' : breakpoint === 'lg' ? 'lg:block xl:hidden' : 'xl:block'} w-full text-center mt-6`}>
          <Button 
            onClick={() => handleShowMore(breakpoint)}
            variant="outline"
            className="w-full max-w-md"
          >
            Show More ({totalShowrooms - currentVisible} remaining)
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-[90%] mx-auto ">
      <h2 className="text-16 md:text-22 font-semibold mb-2">Other Showrooms Ads</h2>

      {/* Mobile View with Swiper (below 500px) */}
      <div className="sm:hidden">
        <SwiperComponent
          slidesPerView={1.2}
          spaceBetween={10}
          centeredSlides={true}
          pagination={false}
          modules={[Navigation, FreeMode]}
          className="mySwiper"
        >
          {otherShowrooms.map(showroom => (
            <SwiperSlide key={showroom.id}>
              <CardUser
                id={showroom.id}
                imageUrl={showroom.images?.url}
                price={showroom.price}
                title={showroom.title}
                location={`${showroom.locationTown?.name}, ${showroom.locationDistrict?.name}`}
                postedDate={formatPostedDate(showroom.createdAt)}
                adBoostTag={showroom.adBoostTag}
                adCategoryId={showroom.adCategory?.id}
                isAdFavourite={showroom.isAdFavourite}
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </div>

      {/* Desktop View - Grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {otherShowrooms.slice(0, getCurrentVisibleCount()).map(showroom => (
            <CardUser
              key={showroom.id}
              id={showroom.id}
              imageUrl={showroom.images?.url}
              price={showroom.price}
              title={showroom.title}
              location={`${showroom.locationTown?.name}, ${showroom.locationDistrict?.name}`}
              postedDate={formatPostedDate(showroom.createdAt)}
              adBoostTag={showroom.adBoostTag}
              adCategoryId={showroom.adCategory?.id}
              isAdFavourite={showroom.isAdFavourite}
            />
          ))}
        </div>

        {/* Show More Buttons for different breakpoints */}
        {renderShowMoreButton('md')}
        {renderShowMoreButton('lg')}
        {renderShowMoreButton('xl')}
      </div>
    </div>
  );
};

export default FindOtherShowrooms;