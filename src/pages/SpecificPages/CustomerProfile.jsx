import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CustomerProfileComponent from '../../components/Specific/Profile/Customerprofile';
import axios from 'axios';
import { Box, Text, Spinner, Center, Button } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronRight } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/pagination';
import { BASE_URL } from '../../config/config';
import CardShowroom from '../../components/common/Cards/CardShowroom';

function CustomerProfile() {
  const { state } = useLocation();
  const { sellerId, sellerName, sellerPhone, sellerProfile } = state || {};
  const [userAds, setUserAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is typically 768px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const fetchUserAds = async () => {
    if (!sellerId) {
      setError('User ID not found');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('UserToken');
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(
        `${BASE_URL}/api/find-other-user-ads/${sellerId}`, 
        { headers }
      );
      
      setUserAds(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch user ads');
      setIsLoading(false);
      console.error('Error fetching user ads:', err);
    }
  };

  useEffect(() => {
    fetchUserAds();
  }, [sellerId]);

  const loadMore = () => {
    setVisibleCards(prevVisibleCards => prevVisibleCards + 6);
  };

  return (
    <div>
      <div className="w-[80%] mx-auto font-Inter">
        <h1 className="py-2 font-semibold flex justify-center">User Profile</h1>
        <CustomerProfileComponent
          sellerId={sellerId}
          sellerName={sellerName}
          sellerPhone={sellerPhone}
          sellerProfile={sellerProfile}
        />

        <Box mt={8}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {sellerName}'s Advertisements
          </Text>

          {isLoading ? (
            <Center py={8}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : error ? (
            <Center py={8}>
              <Text color="red.500">{error}</Text>
            </Center>
          ) : userAds.length === 0 ? (
            <Center py={8}>
              <Text>No advertisements found for this user</Text>
            </Center>
          ) : (
            <>
              {isMobile ? (
                <div className="mt-4">
                  <Swiper
                    spaceBetween={16}
                    slidesPerView={1.6}
                    centeredSlides={false}
                    pagination={{ clickable: true }}
                    className="mySwiper"
                    breakpoints={{
                      0: {
                        slidesPerView: 1.2, // 1.2 slides per view for devices below 400px
                      },
                      400: {
                        slidesPerView: 1.6, // Default for devices 400px and above
                      },
                    }}
                  >
                    {userAds.slice(0, visibleCards).map((ad) => (
                      <SwiperSlide key={ad.id}>
                        <CardShowroom ad={ad} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {userAds.slice(0, visibleCards).map((ad) => (
                    <CardShowroom key={ad.id} ad={ad} />
                  ))}
                </div>
              )}

              {visibleCards < userAds.length && (
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={loadMore}
                    className="bg-[#0071BC] text-white px-4 flex gap-4 font-Inter font-400 rounded-lg"
                    size="sm"
                  >
                    <span className="text-12">See all</span> <FaChevronRight />
                  </Button>
                </div>
              )}
            </>
          )}
        </Box>
      </div>
    </div>
  );
}

export default CustomerProfile;
