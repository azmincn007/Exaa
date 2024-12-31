import { useState } from "react";
import { Star, ChevronDown, Edit2, Share2, Copy, ChevronLeft, ChevronRight, MapPin, Tag, Phone } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaGlobe, FaUserFriends } from "react-icons/fa";
import RatingModal from "../../modal/ReviewModal";
import LoginModal from "../../modals/Authentications/LoginModal";
import { Button, Card, CardBody, CardHeader, Collapse, useToast } from "@chakra-ui/react";
import { useAuth } from "../../../Hooks/AuthContext";
import { BASE_URL } from "../../../config/config";
import { useQuery } from 'react-query';

const ShowroomDetails = ({ 
  imageUrls,
  name, 
  category, 
  showroomCategory, 
  userRating, 
  showroomRating,
  showroomId,
  adCount,
  locationTown,
  logo,
  facebookPageLink,
  websiteLink,
  phone,
  showroomFollowersCount,
  showroomViewsCount,
  myShowroom,
  isUserFollower,
  adShowroomTag
}) => {
  
  const { isLoggedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toast = useToast();
console.log(myShowroom);
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const RatingStars = ({ rating, size = 16 }) => (
    <div className="flex space-x-0.5 md:space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className="transition-colors duration-200"
          style={{
            fill: i < rating ? "#F6E05E" : "#E2E8F0",
            color: i < rating ? "#F6E05E" : "#E2E8F0"
          }}
        />
      ))}
    </div>
  );

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
    const shareText = `Check out this showroom: ${name}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRatingButtonClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };



  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in to follow.",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }

    const userToken = localStorage.getItem('UserToken');
    const url = `${BASE_URL}/api/create-or-delete-showroom-follower`;
    const method = 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ showroomId }),
      });

      if (response.ok) {
        const message = isUserFollower ? "Unfollowed!" : "Followed!";
        toast({
          title: message,
          status: "success",
          duration: 2000,
          position: "top",
        });
      } else {
        throw new Error("Failed to update follow status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  return (
    <div className="w-full p-2 md:p-4 font-Inter">
      <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden border border-gray-200 rounded-xl">
        {/* Image Carousel Section */}
        <CardHeader className="px-3 md:px-4 pb-2 bg-gray-50">
          {/* Logo Section */}
          {logo && (
            <div className="absolute top-4 right-4 z-20 rounded-full">
              <img src= {`${BASE_URL}${logo}`} alt={`${name} Logo`} className="h-16 w-16  rounded-full" />
            </div>
          )}
          {/* Follow Button */}
          {!myShowroom && (
            <button
              className={`absolute top-6 right-6 z-20 ${isUserFollower ? "bg-green-600" : "bg-blue-500"} text-white text-sm font-semibold py-1 px-3 rounded-full shadow-md ${isUserFollower ? "hover:bg-green-600" : "hover:bg-blue-600"} transition duration-200 flex items-center justify-center`}
              onClick={handleFollowToggle}
            >
              {isUserFollower ? (
                <>
                  <FaUserFriends className="mr-1" />
                  Following
                </>
              ) : (
                <>
                  <FaUserFriends className="mr-1" />
                  Follow
                </>
              )}
            </button>
          )}
          <div className="relative w-full pb-[56.25%] mb-3">
            <img
              src={imageUrls[currentImageIndex]}
              alt={`${name} - Image ${currentImageIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-md shadow-sm"
              onError={(e) => {
                e.target.src = "/path/to/fallback-image.jpg";
              }}
            />
            
            {/* Navigation Buttons */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {imageUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold font-Inter text-gray-800 flex-1 pr-2">
                {name}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                {phone && (
                  <button
                    onClick={() => window.location.href = `tel:${phone}`}
                    className="md:hidden p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={() => setIsShareExpanded(!isShareExpanded)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Adjusted spacing */}
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{locationTown}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{adCount} Ads</span>
              </div>
            </div>
          </div>

            {/* Follower and View Counts Section */}
            <div className="flex justify-between w-full max-w-xs text-gray-600 font-medium mt-3">
              <span className="flex items-center space-x-1">
                <FaFacebook className="w-4 h-4 text-gray-600" />
                <span>{showroomFollowersCount} Followers</span>
              </span>
              {myShowroom && (
                <span className="flex items-center space-x-1">
                  <FaGlobe className="w-4 h-4 text-gray-600" />
                  <span>{showroomViewsCount} Views</span>
                </span>
              )}
            </div> 
          
          {/* Share Options Collapse */}
          <Collapse in={isShareExpanded}>
            <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 space-y-2">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                >
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Share on WhatsApp</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Copy Link</span>
                </button>

                {/* New Share Links Section */}
                {facebookPageLink && (
                  <button
                    onClick={() => window.open(facebookPageLink, '_blank')}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Visit Facebook Page</span>
                  </button>
                )}
                
                {websiteLink && (
                  <button
                    onClick={() => window.open(websiteLink, '_blank')}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaGlobe className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Visit Website</span>
                  </button>
                )}
              </div>
            </div>
          </Collapse>
        </CardHeader>

        <CardBody className="px-2 md:px-4 py-2 md:py-3 bg-white">
          <div className="flex flex-col space-y-3 md:space-y-4">
            {/* Category Details Section */}
            <div className="grid grid-cols-12 gap-2 border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700 col-span-6">Category:</span>
              <span className="text-gray-600 col-span-6">{category}</span>
              
              <span className="font-semibold text-gray-700 col-span-6">Showroom Category:</span>
              <span className="text-gray-600 col-span-6">{showroomCategory}</span>
            </div>

            {/* Interactive Rating Section */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="flex flex-col items-start">
                    <span className="text-xs md:text-sm font-medium text-gray-500">Overall Rating</span>
                    <div className="flex items-center space-x-2">
                      <RatingStars rating={showroomRating} size={16} />
                      <span className="text-sm md:text-lg font-semibold text-gray-700">
                        {showroomRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transition-transform duration-200 ${
                    isRatingExpanded ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              <Collapse in={isRatingExpanded}>
                <div className="pt-2 pb-1 px-2 space-y-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-medium text-gray-500">Your Rating</span>
                      <div className="flex items-center space-x-4">
                        <RatingStars rating={userRating} size={14} />
                        <span className="text-xs md:text-sm font-medium text-gray-700 ml-2">
                          {userRating ? userRating.toFixed(1) : "Not rated yet"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<Edit2 size={14} />}
                      onClick={handleRatingButtonClick}
                      className="hover:bg-blue-50 text-xs md:text-sm py-1 h-8"
                    >
                      {userRating ? "Update" : "Rate Now"}
                    </Button>
                  </div>

                  <div className="text-[10px] md:text-xs text-gray-500 pb-1">
                    Click rate now to share your experience with this showroom
                  </div>

             
                </div>
              </Collapse>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showroomId={showroomId}
        initialRating={userRating}
      />
    </div>
  );
};

export default ShowroomDetails;