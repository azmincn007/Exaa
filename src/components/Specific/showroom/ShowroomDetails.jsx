import { useState } from "react";
import { Star, ChevronDown, Edit2, Share2, Copy } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import RatingModal from "../../modal/ReviewModal";
import LoginModal from "../../modals/Authentications/LoginModal";
import { Button, Card, CardBody, CardHeader, Collapse, useToast } from "@chakra-ui/react";
import { useAuth } from "../../../Hooks/AuthContext";

const ShowroomDetails = ({ 
  imageUrl, 
  name, 
  category, 
  showroomCategory, 
  userRating, 
  showroomRating,
  showroomId
}) => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const toast = useToast();

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

  return (
    <div className="w-full p-2 md:p-4 font-Inter">
      <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden border border-gray-200 rounded-xl">
        {/* Image and Name Section */}
        <CardHeader className="px-3 md:px-4 pb-2 bg-gray-50">
          <div className="relative w-full pb-[56.25%] mb-3">
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover rounded-md shadow-sm"
              onError={(e) => {
                e.target.src = "/path/to/fallback-image.jpg";
              }}
            />
          </div>
          
          <div className="flex justify-between items-start">
            <h2 className="text-lg md:text-xl font-bold truncate font-Inter text-gray-800">
              {name}
            </h2>
            <button
              onClick={() => setIsShareExpanded(!isShareExpanded)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
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

            {/* Interactive Rating Section - Updated for better mobile layout */}
            <div className="flex flex-col space-y-2">
              {/* Overall Rating Button */}
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

              {/* Expandable Content - Updated for better mobile layout */}
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

      {/* LoginModal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Rating Modal */}
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