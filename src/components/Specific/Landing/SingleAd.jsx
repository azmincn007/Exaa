import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaCommentDollar, FaComments, FaWhatsapp } from 'react-icons/fa';
import { ArrowRight, Copy, Share2, Heart } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure, useToast, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import CarCar from '../AdSingleStructure/CarCar';
import Rest from '../AdSingleStructure/Rest';
import SkeletonSingleAdPage from '../../Skelton/singleadPageskelton';
import LoginModal from '../../modals/Authentications/LoginModal';
import { useAuth } from '../../../Hooks/AuthContext';
import PriceAdjuster from '../AdSingleStructure/PriceAdjuster';
import SimilarAds from './SimilarAds';
import NearbyShowroomAds from './NearbyShowroomads';
import FindOtherShowrooms from './FindOtherShowroomAds';
import { Facebook } from 'lucide-react';
import { FcLike } from 'react-icons/fc';
import DummyBreadcrumb from '../AdSingleStructure/DummyBreadCrumb';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import AdBoostBadge from '../../common/buttons/AdBoostBadge';
import { Phone } from 'lucide-react';
import ChatWarningModal from '../../modals/othermodals/ChatWarningModal';

const fetchAdData = async ({ queryKey }) => {
  const [_, adCategoryId, adId, token] = queryKey;
  const config = {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
  
  const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`, config);
  console.log(data.data);
  
  return data.data;
};

const findOrCreateChat = async ({ adId, adCategoryId, adBuyerId, adSellerId, token, message, isOfferMessage }) => {
  try {
    if (isOfferMessage) {
      const { data } = await axios.post(
        `${BASE_URL}/api/ad-chats`,
        {
          adId,
          adCategoryId,
          adBuyerId,
          message,
          isOfferMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data, isNewChat: true };
    } else {
      const { data } = await axios.get(
        `${BASE_URL}/api/find-one-chat/${adId}/${adCategoryId}/${adBuyerId}/${adSellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data, isNewChat: false };
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const { data } = await axios.post(
        `${BASE_URL}/api/ad-chats`,
        {
          adId,
          adCategoryId,
          adBuyerId,
          message,
          isOfferMessage
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
  const params = new URLSearchParams(location.search);
  const adCategoryId = params.get('categoryId');
  const adId = params.get('adId');
  const subCategoryId = params.get('subCategoryId');
  
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPriceAdjusterOpen, setIsPriceAdjusterOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
      if (data.data && (isNewChat || data.data.ad)) {
        navigate(`/chats/all`, { state: { selectedChatId: data.data?.id } });
      } else {
        navigate(`/chats/all`);
      }
    },
    onError: (error) => {
      console.error('Error finding/creating chat:', error);
    },
  });

  const [isAdFavourite, setIsAdFavourite] = useState(adData?.isAdFavourite || false);

  useEffect(() => {
    if (adData) {
      setIsAdFavourite(adData.isAdFavourite);
    }
  }, [adData]);

  console.log(adData?.isAdFavourite);
  
console.log(isAdFavourite);
  const addFavoriteMutation = useMutation(
    async () => {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.post(
        `${BASE_URL}/api/ad-favourites`,
        { adId, adCategoryId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        setIsAdFavourite(true);
      },
    }
  );

  const deleteFavoriteMutation = useMutation(
    async () => {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.delete(
        `${BASE_URL}/api/ad-delete-favourite/${adId}/${adCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        setIsAdFavourite(false);
      },
    }
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('UserToken');
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isAdFavourite) {
      deleteFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

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
        message: 'Hi, I want to know more details',
        isOfferMessage: false
      });
    }
  };

  const handleMakeOffer = () => {
    if (!isLoggedIn || !token) {
      setIsLoginModalOpen(true);
    } else {
      setIsPriceAdjusterOpen(true);
    }
  };

  const handleOfferSubmit = (adjustedPrice) => {
    chatMutation.mutate({
      adId,
      adCategoryId,
      adBuyerId: adData?.adBuyer?.id,
      adSellerId: adData?.adSeller?.id,
      token,
      message: `Hi, I want to make an offer at ₹${adjustedPrice.toFixed(2)}`,
      isOfferMessage: true
    });
    setIsPriceAdjusterOpen(false);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageCount - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
  };

  const handleSellerProfileClick = () => {
    if (adData?.adSeller) {
      navigate(`/customer-profile/${adData.adSeller.id}`);
    }
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copied!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy link",
        status: "error",
        duration: 2000,
        position: "top",
      });
    });
  };

  const handleWhatsAppShare = () => {
    const currentUrl = window.location.href;
    const shareText = `Check out this ad: ${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const currentUrl = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleInstagramShare = () => {
    toast({
      title: "Copy link to share on Instagram",
      description: "Instagram doesn't support direct sharing via link",
      status: "info",
      duration: 3000,
      position: "top",
    });
    handleCopyLink();
  };

  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isChatWarningOpen, setIsChatWarningOpen] = useState(false);

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    return number;  // Return the number as is, without formatting
  };

  const handleCallSeller = () => {
    setIsChatWarningOpen(true);
  };

  const handleWarningClose = () => {
    setIsChatWarningOpen(false);
    setShowPhoneNumber(true);
  };

  if (isLoading) return <SkeletonSingleAdPage />;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!adData) return <div>No data available for this ad.</div>;

  const images = adData.images || [];
  const imageCount = images.length;
  const currentImageUrl = imageCount > 0 ? `${BASE_URL}${images[currentImageIndex].url}` : '';

  const isCarCategory = adData.adCategory?.id === 2 && adData.adSubCategory?.id === 11;

  return (
    <div>
      <div className='px-4 py-2'>

      <DummyBreadcrumb className="w-full md:w-[70%]" title={adData.title} locationDistrict={adData.locationDistrict.name} locationTown={adData.locationTown.name} adCategory={adData.adCategory} adSubCategory={adData.adSubCategory} />
      </div>
      <div className="my-8 font-Inter">

      <div className="w-[90%] mx-auto block">
        {/* Images Section */}
        <div className="w-full md:w-[70%] mb-4 md:float-left md:pr-8">
          <div className="relative flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-lg h-[300px]">
              <div className="absolute top-4 left-4 z-20">
                <AdBoostBadge tag={adData.adBoostTag} />
              </div>
              <button 
                onClick={handlePrevClick}
                className="absolute left-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <FaChevronLeft className="text-white text-xl" />
              </button>
              
              <div className="absolute top-4 right-4 z-20 flex gap-3">
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <button 
                      className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Share2 size={20} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-white rounded-lg shadow-lg p-2">
                    <PopoverBody>
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={handleWhatsAppShare}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Share on WhatsApp"
                        >
                          <FaWhatsapp size={20} className="text-green-600" />
                        </button>
                        
                        <button
                          onClick={handleFacebookShare}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          title="Share on Facebook"
                        >
                          <Facebook size={20} className="text-blue-600" />
                        </button>
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                
                {isLoggedIn && (
                  <button 
                    className="p-2 rounded-full transition-colors text-white"
                    onClick={handleFavoriteClick}
                  >
                    {isAdFavourite ? (
                      <BiSolidHeart className="w-5 h-5 text-red-500" />
                    ) : (
                      <BiHeart className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
              
              <div 
                className="w-full h-full px- bg-black flex justify-center items-center cursor-pointer" 
                onClick={onOpen}
              >
                <img
                  src={currentImageUrl}
                  alt={`Ad Image ${currentImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                
                {/* Image Pagination Bullets */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                        ${currentImageIndex === index 
                          ? 'bg-blue-500 scale-110' 
                          : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <button 
                onClick={handleNextClick}
                className="absolute right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <FaChevronRight className="text-white text-xl" />
              </button>
            </div>

            {/* Thumbnails Container */}
            {imageCount > 0 && (
              <div className="flex gap-4 overflow-x-auto py-2 px-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
                      flex-shrink-0 cursor-pointer transition-all duration-200
                      ${currentImageIndex === index 
                        ? 'ring-2 ring-blue-500 ring-offset-2' 
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                      }
                      rounded-lg overflow-hidden
                    `}
                  >
                    <img
                      src={`${BASE_URL}${image.url}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile-only Content Section */}
        <div className="w-full md:hidden mb-4">
          <div className="grid grid-cols-12 gap-4">
            {isCarCategory ? <CarCar adData={adData} /> : <Rest adData={adData} />}
          </div>
          
          <div className="mt-8">
            <div className="font-semibold text-lg md:text-xl">Description</div>
            <p className="text-sm md:text-base text-gray-500">
              {adData.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="w-full md:w-[30%] flex flex-col gap-4 md:float-left">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col gap-4">
              <Button 
                className="w-full bg-green-500 gap-2 text-white text-sm md:text-base py-6"
                onClick={handleMakeOffer}
              >
                <FaCommentDollar /> Make Offer
              </Button>
              <Button 
                className="w-full bg-green-600 gap-2 text-white text-sm md:text-base py-6"
                onClick={handleWhatsAppShare}
              >
                <FaWhatsapp className="text-lg" /> Share on WhatsApp
              </Button>
              <Button 
                className="w-full bg-gray-600 gap-2 text-white text-sm md:text-base py-6"
                onClick={handleCopyLink}
              >
                <Copy className="text-lg" /> Copy Link
              </Button>
            </div>
            <div className="flex justify-between items-end mt-8">
              <p className="font-semibold">Ad id</p>
              <p>{adData.id}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div 
              className="flex items-center justify-between cursor-pointer mb-4" 
              onClick={handleSellerProfileClick}
            >
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
            
            <Button
              className="w-full bg-white border-cyan-600 border-2 gap-2 text-cyan-600 font-semibold text-sm md:text-base py-6 mb-4"
              onClick={handleChatWithSeller}
              isLoading={chatMutation.isLoading}
            >
              <FaComments /> Chat with Seller
            </Button>

            {/* Call Seller Button - Mobile Only */}
            <div className="md:hidden">
              <Button
                className="w-full bg-white border-green-600 border-2 gap-2 text-green-600 font-semibold text-sm md:text-base py-6 mb-4"
                onClick={handleCallSeller}
              >
                <Phone className="w-5 h-5" /> Call Seller
              </Button>

              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-500 tracking-wider">
                  {showPhoneNumber ? (
                    <a href={`tel:${adData.adSeller?.phone}`} className="text-green-600 hover:text-green-700">
                      {adData.adSeller?.phone}
                    </a>
                  ) : (
                    '**********'
                  )}
                </span>
                {!showPhoneNumber && (
                  <button 
                    className="text-blue-500 underline text-14 font-Inter hover:text-blue-600"
                    onClick={() => setShowPhoneNumber(true)}
                  >
                    Show number
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop-only Content Section */}
        <div className="hidden md:block md:clear-both pt-8">
          <div className="grid grid-cols-12 gap-4">
            {isCarCategory ? <CarCar adData={adData} /> : <Rest adData={adData} />}
          </div>
          
          <div className="mt-8">
            <div className="font-semibold text-lg md:text-xl">Description</div>
            <p className="text-sm md:text-base text-gray-500">
              {adData.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton className="text-white" />
          <ModalBody className="flex justify-center items-center bg-black/90">
            <img
              src={currentImageUrl}
              alt={`Full View Ad Image ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            
            {/* Modal Image Pagination Bullets */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 
                    ${currentImageIndex === index 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                    }
                    shadow-md`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-8 right-8 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {imageCount}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className='mt-8'>
        <SimilarAds 
          adId={adId}
          adCategoryId={adCategoryId}
        />
      </div>

      {adData.adShowroom && (
        <div className='mt-2'>
          <NearbyShowroomAds
            adShowroomId={adData.adShowroom.id}
          />
        </div>
      )}

      {adData.adShowroom && (
        <div className='mt-2'>
          <FindOtherShowrooms
            adId={adId}
            adCategoryId={adCategoryId}
            adShowroomId={adData.adShowroom.id}
          />
        </div>
      )}

      <PriceAdjuster
        initialPrice={adData.price}
        onSubmit={handleOfferSubmit}
        isOpen={isPriceAdjusterOpen}
        onClose={() => setIsPriceAdjusterOpen(false)}
      />

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <ChatWarningModal 
      phoneNumber={adData.adSeller?.phone}
        isOpen={isChatWarningOpen} 
        onClose={handleWarningClose}
      />
    </div>
    </div>
  );
}

export default SingleAd;