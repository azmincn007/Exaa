import React from 'react';
import { Image, Text, Badge } from '@chakra-ui/react';
import { Eye, Heart, MapPin } from 'lucide-react';
import { BASE_URL } from '../../../config/config';

const AdListing = ({ isActive, image, title, price, views, likes, location, postedDate, adCategory, description, adSubcategory }) => {
  const formatDescription = (description) => {
    if (!description) return 'No description available.';
    const firstLine = description.split('\n')[0]; // Get only first line
    return firstLine.length > 100 ? `${firstLine.substring(0, 100)}...` : firstLine;
  };
  
  const renderPriceOrService = () => {
    if (price) {
      return <p className='font-bold text-xl'>₹ {price}</p>;
    } else {
      return <p className='font-bold text-16 text-green-600'>Service</p>;
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md mb-4 font-Inter">
      <div className="flex">
        {/* Left side - Image */}
        <div className="relative w-48 h-48">
          <Image
            src={`${BASE_URL}${image}`}
            alt={title}
            className="object-cover w-full h-full"
          />
          {isActive && (
            <Badge className="absolute top-2 left-2" colorScheme="green">
              Active
            </Badge>
          )}
        </div>
        {/* Right side - Content */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text className="text-18 font-bold font-Inter">
              {title}
            </Text>
            <Badge className="bg-yellow-400 text-white font-semibold">{adCategory}</Badge>
          </div>
          <Text className="text-sm text-gray-600 line-clamp-1">
            {formatDescription(description)}
          </Text>
          {renderPriceOrService()}
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Eye size={16} />
                <Text className="ml-1 mr-4">{views}</Text>
                <Heart size={16} />
                <Text className="ml-1">{likes}</Text>
              </div>
            </div>
            <div className=' simple-flex '>
              <div className="flex  items-center">
                <MapPin className='text-gray-500' size={16} />
                <Text className="ml-1 text-14 text-gray-500">{location}</Text>
              </div>
              <div>
                <Text className="text-14 text-gray-500">
                  Posted On: {postedDate}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdListing;