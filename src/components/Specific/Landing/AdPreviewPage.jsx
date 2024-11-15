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
import Breadcrumb from '../AdSingleStructure/DummyBreadCrumb';

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
    <div>
      <div className="px-4 py-2">
        <Breadcrumb 
          title={adData.title} 
          locationDistrict={adData.locationDistrict?.name} 
          locationTown={adData.locationTown?.name} 
          adCategory={adData.adCategory?.name} 
          adSubCategory={adData.adSubCategory?.name} 
        />
      </div>
      <div className="my-8 font-Inter">
      
      <div className="w-[90%] mx-auto block">
        {/* Images Section */}
        <div className="w-full md:w-[70%] mb-4 md:float-left md:pr-8">
          <div className="relative flex flex-col gap-4">
            {/* Main Image Container */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-lg h-[300px]">
              <button 
                onClick={handlePrevClick}
                className="absolute left-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              >
                <FaChevronLeft className="text-white text-xl" />
              </button>
              
              {imageCount > 0 ? (
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
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  No Image Available
                </div>
              )}
              
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

            {/* Share Buttons */}
            <div className="flex flex-col gap-4">
              <Button 
                className={`w-full gap-2 text-white text-sm md:text-base py-6 ${
                  isActive ? 'bg-green-600' : 'bg-green-600 opacity-50'
                }`}
                onClick={handleWhatsAppShare}
                disabled={!isActive}
              >
                <FaWhatsapp className="text-lg" /> Share on WhatsApp
              </Button>
              <Button 
                className={`w-full gap-2 text-white text-sm md:text-base py-6 ${
                  isActive ? 'bg-gray-600' : 'bg-gray-600 opacity-50'
                }`}
                onClick={handleCopyLink}
                disabled={!isActive}
              >
                <Copy className="text-lg" /> Copy Link
              </Button>
            </div>

            {/* Status notice if applicable */}
            {!isActive && (
              <div className="mt-4 text-red-500 text-sm text-center">
                {getShareButtonStatus()}
              </div>
            )}

            <div className="flex justify-between items-end mt-8">
              <p className="font-semibold">Ad id</p>
              <p>{adData.id}</p>
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
    </div>
    </div>
  );
}

export default AdPreviewPage;