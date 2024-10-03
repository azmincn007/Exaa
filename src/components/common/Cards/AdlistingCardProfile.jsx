import React, { useState } from 'react';
import { Image, Text, Badge, IconButton, useDisclosure } from '@chakra-ui/react';
import { Eye, Heart, MapPin, Edit, Trash2 } from 'lucide-react';
import { BASE_URL } from '../../../config/config';
import SellModal from '../../modals/othermodals/SellModal';
import SellModalEdit from '../../modals/othermodals/SellmodalEdit';

const AdListingCardProfile = ({ listing, onDelete }) => {
  
  const {
    id,
    isActive,
    images,
    title,
    price,
    adViewCount,
    adFavouriteCount,
    locationTown,
    createdAt,
    adCategory,
    adSubCategory,
    description
  } = listing;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleEditClick = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md mb-4 font-Inter">
        <div className="flex">
          <div className="relative w-48 h-48">
            <Image
              src={`${BASE_URL}${images?.url}`}
              alt={title}
              className="object-cover w-full h-full"
            />
            {isActive && (
              <Badge className="absolute top-2 left-2" colorScheme="green">
                Active
              </Badge>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Text className="text-18 font-bold font-Inter">
                {title}
              </Text>
              <div className="flex items-center">
                <Badge className="bg-yellow-400 text-white font-semibold mr-2">{adCategory?.name}</Badge>
                <IconButton
                  icon={<Edit size={16} />}
                  aria-label="Edit"
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => handleEditClick(listing)}
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  aria-label="Delete"
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => onDelete(id, adSubCategory.id)}
                />
              </div>
            </div>
            <Text>{description}</Text>
            <Text className="text-20 font-bold text-blue-500">
              ₹{price.toLocaleString()}
            </Text>
            <div className="mt-auto flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Eye size={16} />
                  <Text className="ml-1 mr-4">{adViewCount}</Text>
                  <Heart size={16} />
                  <Text className="ml-1">{adFavouriteCount}</Text>
                </div>
              </div>
              <div className='simple-flex justify-between'>
                <div className="flex items-center">
                  <MapPin className='text-gray-500' size={16} />
                  <Text className="ml-1 text-14 text-gray-500">{locationTown?.name}</Text>
                </div>
                <div>
                  <Text className="text-14 text-gray-500">
                    Posted On: {formatDate(createdAt)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SellModalEdit 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        listingData={selectedListing}
      />
    </>
  );
};

export default AdListingCardProfile;