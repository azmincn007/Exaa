import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaWhatsapp } from 'react-icons/fa';
import { Copy, Heart, Eye } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure, useToast } from '@chakra-ui/react';
import { BASE_URL } from '../../../config/config';
import CarCar from '../AdSingleStructure/CarCar';
import Rest from '../AdSingleStructure/Rest';
import SkeletonSingleAdPage from '../../Skelton/singleadPageskelton';

const fetchAdData = async ({ queryKey }) => {
  const [_, adCategoryId, adId] = queryKey;
  const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`);
  console.log(data.data);
  
  return data.data;
};

function AdPreviewPage() {
  const location = useLocation();
  const { adCategoryId, adId, isExpired, isPending, isActive } = location.state || {};
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: adData, isLoading, error } = useQuery(
    ['adPreviewData', adCategoryId, adId],
    fetchAdData,
    {
      enabled: !!adCategoryId && !!adId,
    }
  );

  if (!adCategoryId || !adId) {
    return <Navigate to="/" replace />;
  }

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageCount - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
  };

  const handleCopyLink = () => {
    // Early return if ad is not active
    if (!isActive) {
      return;
    }
    
    const previewLink = `${window.location.origin}/#details/${adId}/${adCategoryId}`;
    navigator.clipboard.writeText(previewLink).then(() => {
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
    // Early return if ad is not active
    if (!isActive) {
      return;
    }
    
    const previewLink = `${window.location.origin}/ads/${adCategoryId}/${adId}`;
    const shareText = `Check out this ad: ${previewLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) return <SkeletonSingleAdPage />;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!adData) return <div>No data available for this ad.</div>;

  const images = adData.images || [];
  const imageCount = images.length;
  const currentImageUrl = imageCount > 0 ? `${BASE_URL}${images[currentImageIndex].url}` : '';

  const isCarCategory = adData.adCategory?.id === 2 && adData.adSubCategory?.id === 11;

  const getShareButtonStatus = () => {
    if (isPending) return "This ad is pending approval. Sharing features are disabled.";
    if (isExpired) return "This ad has expired. Sharing features are disabled.";
    return null;
  };

  return (
    <div className="my-16 font-Inter">
      <div className="relative flex items-center justify-center w-4/5 mx-auto overflow-hidden gap-16">
        <FaChevronLeft onClick={handlePrevClick} className="cursor-pointer" />
        {imageCount > 0 ? (
          <div className="w-full bg-black flex justify-center items-center cursor-pointer" onClick={onOpen}>
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
        <FaChevronRight onClick={handleNextClick} className="cursor-pointer" />
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="flex justify-center items-center">
            <img
              src={currentImageUrl}
              alt={`Full View Ad Image ${currentImageIndex + 1}`}
              className="max-h-[80vh] object-contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {isCarCategory ? <CarCar adData={adData} /> : <Rest adData={adData} />}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <div className="bg-white p-4">
              {/* Stats Display */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg">
                  <Eye className="mr-2" />
                  <span className="text-14 font-semibold">{adData.adViewCount}</span>
                </div>
                <div className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg">
                  <Heart className="mr-2" />
                  <span className="text-14 font-semibold">{adData.adFavouriteCount}</span>
                </div>
              </div>
              
              {/* Share Buttons with conditional opacity */}
              <div className="flex gap-4">
                <button 
                  className={`w-full flex items-center justify-center gap-2 p-2 rounded ${
                    isActive 
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                      : 'bg-green-600 opacity-50 cursor-not-allowed text-white'
                  }`}
                  onClick={handleWhatsAppShare}
                  disabled={!isActive}
                >
                  <FaWhatsapp className="text-lg" /> Share
                </button>
                <button 
                  className={`w-full flex items-center justify-center gap-2 p-2 rounded ${
                    isActive 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer' 
                      : 'bg-gray-600 opacity-50 cursor-not-allowed text-white'
                  }`}
                  onClick={handleCopyLink}
                  disabled={!isActive}
                >
                  <Copy className="text-lg" /> Copy Link
                </button>
              </div>

              {/* Status notice if applicable */}
              {!isActive && (
                <div className="mt-4 text-red-500 text-sm text-center">
                  {getShareButtonStatus()}
                </div>
              )}

              {/* Ad ID Display */}
              <div className="flex justify-between items-end mt-8">
                <p className="font-semibold">Ad id</p>
                <p>{adData.id}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="font-semibold text-lg md:text-xl">Description</div>
          <p className="text-sm md:text-base text-gray-500">{adData.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
}

export default AdPreviewPage;