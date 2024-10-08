import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaCommentDollar, FaComments } from 'react-icons/fa';
import { MdRemoveRedEye } from 'react-icons/md';
import { CiHeart } from 'react-icons/ci';
import { ArrowRight } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import CarCar from '../AdSingleStructure/CarCar';
import Rest from '../AdSingleStructure/Rest';
import SkeletonSingleAdPage from '../../Skelton/singleadPageskelton';
import LoginModal from '../../modals/Authentications/LoginModal';
import { useAuth } from '../../../Hooks/AuthContext';

const fetchAdData = async ({ queryKey }) => {
  const [_, adCategoryId, adId, token] = queryKey;
  const config = {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
  
  const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`, config);
  console.log(data.data);
  
  return data.data;
};

const findOrCreateChat = async ({ adId, adCategoryId, adBuyerId, adSellerId, token }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/find-one-chat/${adId}/${adCategoryId}/${adBuyerId}/${adSellerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data, isNewChat: false };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const { data } = await axios.post(
        `${BASE_URL}/api/ad-chats`,
        {
          adId,
          adCategoryId,
          adBuyerId,
          message: 'Hi, I want to know more details about that',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data, isNewChat: true };
    }
    throw error;
  }
};

function SingleAd() {
  const { id: adId, adCategoryId } = useParams();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { isLoggedIn, token } = useAuth();

  const { data: adData, isLoading, error } = useQuery(
    ['adData', adCategoryId, adId, token],
    fetchAdData,
    {
      enabled: !!adCategoryId && !!adId,
    }
  );

  const chatMutation = useMutation(findOrCreateChat, {
    onSuccess: (result) => {
      const { data, isNewChat } = result;
      if (isNewChat) {
        navigate(`/chats/all`, { state: { selectedChatId: data.data?.id } });
      } else if (data.data && data.data.ad) {
        navigate(`/chats/all`, { state: { selectedChatId: data.data.ad.id } });
      } else {
        navigate(`/chats/all`);
      }
    },
    onError: (error) => {
      console.error('Error finding/creating chat:', error);
    },
  });

  const handleChatWithSeller = () => {
    if (!isLoggedIn || !token) {
      setIsLoginModalOpen(true);
    } else {
      chatMutation.mutate({
        adId,
        adCategoryId,
        adBuyerId: adData?.adBuyer?.id,
        adSellerId: adData?.adSeller?.id,
        token,
      });
    }
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageCount - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
  };

  if (isLoading) return <SkeletonSingleAdPage />;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!adData) return <div>No data available for this ad.</div>;

  const images = adData.images || [];
  const imageCount = images.length;
  const currentImageUrl = imageCount > 0 ? `${BASE_URL}${images[currentImageIndex].url}` : '';

  const isCarCategory = adData.adCategory?.id === 2 && adData.adSubCategory?.id === 11;

  return (
    <div className="my-16 font-Inter">
      <div className="relative flex items-center justify-center w-4/5 mx-auto overflow-hidden gap-16">
        <FaChevronLeft onClick={handlePrevClick} />
        {imageCount > 0 ? (
          <div className="w-full bg-black flex justify-center items-center">
            <img
              src={currentImageUrl}
              alt={`Ad Image ${currentImageIndex + 1}`}
              className="max-h-[300px] max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            No Image Available
          </div>
        )}
        <FaChevronRight onClick={handleNextClick} />
      </div>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {isCarCategory ? <CarCar adData={adData} /> : <Rest adData={adData} />}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-4">
              <div className="flex gap-4 px-4 mb-4">
                <Button className="w-full bg-green-500 gap-2 text-white text-sm md:text-base">
                  <FaCommentDollar /> Make Offer
                </Button>
                <Button
                  className="w-full bg-blue-500 gap-2 text-white text-sm md:text-base"
                  onClick={handleChatWithSeller}
                  isLoading={chatMutation.isLoading}
                >
                  <FaComments /> Chat with Seller
                </Button>
              </div>
              <div className="flex gap-4 px-4">
                <Button className="w-full bg-gray-200 gap-2 text-gray-700 text-sm md:text-base">
                  <MdRemoveRedEye /> {adData.adViewCount || 0}
                </Button>
                <Button className="w-full bg-gray-200 gap-2 text-gray-700 text-sm md:text-base">
                  <CiHeart /> {adData.adFavouriteCount || 0}
                </Button>
              </div>
              <div className="flex justify-between items-end mt-8">
                <p className="font-semibold">Ad id</p>
                <p>{adData.id}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {adData.adSeller?.profileImage?.url && (
                    <img 
                      src={`${BASE_URL}${adData.adSeller.profileImage.url}`} 
                      className="w-full h-full object-cover" 
                      alt="Seller" 
                    />
                  )}
                </div>
                <h2 className="text-14 font-semibold">{adData.adSeller?.name || 'Unknown Seller'}</h2>
              </div>
              <ArrowRight className="text-gray-600" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="font-semibold text-lg md:text-xl">Description</div>
          <p className="text-sm md:text-base text-gray-500">{adData.description || 'No description available.'}</p>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

export default SingleAd;