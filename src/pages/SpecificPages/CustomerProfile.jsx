import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomerProfileComponent from '../../components/Specific/Profile/Customerprofile';
import axios from 'axios';
import { Box, Text, Spinner, Center, Button } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronRight, FaUser } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/pagination';
import { BASE_URL } from '../../config/config';
import CardShowroom from '../../components/common/Cards/CardShowroom';
import { useQuery } from 'react-query';

function CustomerProfile() {
  const { customerId } = useParams();
  console.log(customerId);
  
  const [userAds, setUserAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  const { data: sellerData, isLoading: profileLoading } = useQuery(
    ['userProfile', customerId],
    async () => {
      if (!customerId) throw new Error('User ID not found');
      
      const response = await axios.get(
        `${BASE_URL}/api/user/userProfile/${customerId}`
      );
      console.log(response.data);
      
      return response.data;
    },
    {
      enabled: !!customerId
    }
  );

  const sellerName = sellerData?.data?.name;
  const sellerPhone = sellerData?.data?.phone;
  const sellerProfile = sellerData?.data?.profileImage?.url;
  const sellerLocation = sellerData?.data?.userLocation;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is typically 768px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const fetchUserAds = async () => {
    if (!customerId) {
      setError('User ID not found');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/find-other-user-ads/${customerId}`
      );
      
      console.log('User Ads Response:', response.data);
      setUserAds(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user ads:', err.response || err);
      setError('Failed to fetch user ads');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAds();
  }, [customerId]);

  const loadMore = () => {
    setVisibleCards(prevVisibleCards => prevVisibleCards + 6);
  };

  return (
    <div>
      <div className="w-[80%] mx-auto font-Inter">
        <h1 className="py-2 font-semibold flex justify-center">User Profile-{sellerName}</h1>
        <CustomerProfileComponent
          sellerId={customerId}
          sellerName={sellerName}
          sellerPhone={sellerPhone}
          sellerProfile={sellerProfile}
          sellerLocation={sellerLocation}
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
                        <CardShowroom ad={ad} defaultIcon={<FaUser />} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {userAds.slice(0, visibleCards).map((ad) => (
                    <CardShowroom key={ad.id} ad={ad} defaultIcon={<FaUser />} />
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
