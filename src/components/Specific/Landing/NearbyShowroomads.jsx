import React, { useState } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import NearbyCard from '../../common/Cards/nearbyCard';

const fetchNearbyShowrooms = async (adShowroomId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/find-nearby-ad-showrooms/${adShowroomId}`
    );
    return data.data;
  } catch (error) {
    console.error('Error fetching nearby showrooms:', error);
    throw error;
  }
};

const NearbyShowroomAds = ({ adShowroomId }) => {
  const [visibleCards, setVisibleCards] = useState({
    md: 2,
    lg: 3,
    xl: 4
  });

  const { data: nearbyShowrooms, isLoading, error } = useQuery(
    ['nearbyShowrooms', adShowroomId],
    () => fetchNearbyShowrooms(adShowroomId),
    {
      enabled: !!adShowroomId,
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
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Nearby Showrooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in NearbyShowroomAds:', error);
    return null;
  }

  if (!nearbyShowrooms?.length) {
    return null;
  }

  const getCurrentVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return visibleCards.xl;
      if (window.innerWidth >= 1024) return visibleCards.lg;
      return visibleCards.md;
    }
    return visibleCards.md;
  };

  const renderShowMoreButton = (breakpoint) => {
    const totalShowrooms = nearbyShowrooms.length;
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
    <div className="container mx-auto px-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Nearby Showrooms</h2>

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
          {nearbyShowrooms.map(showroom => (
            <SwiperSlide key={showroom.id}>
              <NearbyCard
                name={showroom.name}
                locationTown={showroom.locationTown?.name}
                locationDistrict={showroom.locationDistrict?.name}
                imageUrl={showroom.images?.url}
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </div>

      {/* Desktop View - Grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nearbyShowrooms.slice(0, getCurrentVisibleCount()).map(showroom => (
            <NearbyCard
              key={showroom.id}
              name={showroom.name}
              locationTown={showroom.locationTown?.name}
              locationDistrict={showroom.locationDistrict?.name}
              imageUrl={showroom.images?.url}
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

export default NearbyShowroomAds;