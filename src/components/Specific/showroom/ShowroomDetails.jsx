import { useState } from "react";
import { Star } from "lucide-react";
import RatingModal from "../../modal/ReviewModal";
import { Button, Card, CardBody, CardHeader } from "@chakra-ui/react";

const ShowroomDetails = ({ imageUrl, name, category, showroomCategory, userRating, showroomId }) => {
  const [rating, setRating] = useState(userRating);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);

  return (
    <div className="w-full p-2 md:p-4 font-Inter bg-blue-500">
      <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden">
        <CardHeader className="px-3 md:px-4 space-y-2">
          <div className="relative w-full pb-[56.25%]">
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover rounded-md"
              onError={(e) => {
                e.target.src = "/path/to/fallback-image.jpg";
              }}
            />
          </div>
          
          <h2 className="text-lg md:text-xl font-bold truncate mt-2 font-Inter">
            {name}
          </h2>
        </CardHeader>

        <CardBody className="px-3 md:px-4 py-0 pb-4">
          <div className="flex flex-col space-y-4">
            {/* Category Details */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col md:flex-row gap-2 text-sm md:text-base">
                <span className="font-semibold">Category:</span>
                <span className="text-gray-600">{category}</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 text-sm md:text-base">
                <span className="font-semibold">Showroom Category:</span>
                <span className="text-gray-600">{showroomCategory}</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                {userRating === 0 ? (
                  <span className="text-sm text-gray-500">
                    Rating not available
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          style={{
                            fill: i < rating ? "#F6E05E" : "#E2E8F0",
                            color: i < rating ? "#F6E05E" : "#E2E8F0"
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full md:w-auto text-sm md:text-base"
                onClick={onOpen}
              >
                Post Rating
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={onClose}
        showroomId={showroomId}
      />
    </div>
  );
};

export default ShowroomDetails;