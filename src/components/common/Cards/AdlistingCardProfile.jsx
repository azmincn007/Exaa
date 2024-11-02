import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Text, Badge, IconButton, useDisclosure } from '@chakra-ui/react';
import { Eye, Heart, MapPin, Edit, Trash2, RefreshCw } from 'lucide-react';
import { BASE_URL } from '../../../config/config';
import SellModalEdit from '../../modals/othermodals/SellmodalEdit';
import DeleteConfirmationDialog from '../../modals/othermodals/DeleteConfirmation';

const AdListingCardProfile = ({ listing, onDelete, onRepost, isExpired, isPending ,isActive}) => {
  console.log(isPending);
  
  const navigate = useNavigate();
  const {
    id,
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = (e, listing) => {
    e.stopPropagation(); // Prevent card click navigation
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    setIsDeleteDialogOpen(true);
  };

  const handleRepostClick = (e, id) => {
    e.stopPropagation(); // Prevent card click navigation
    onRepost(id);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id, adSubCategory.id);
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCardClick = () => {
    navigate('/ad-preview', { 
      state: { 
        adCategoryId: adCategory?.id,
        adId: id,
        isExpired,
        isPending,
        isActive
      } 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date?.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  };

  const truncateDescription = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <>
      {/* Card Container */}
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden shadow-md mb-4 font-Inter cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        {/* Flex container that switches to block on mobile */}
        <div className="flex flex-col md:flex-row">
          {/* Image container */}
          <div className="relative w-full md:w-48 h-48">
            <Image
              src={`${BASE_URL}${images?.url}`}
              alt={title}
              className={`object-cover w-full h-full ${isExpired ? 'opacity-60' : ''}`}
            />
            {isPending ? (
              <Badge 
                className="absolute top-2 left-2" 
                colorScheme="yellow"
              >
                Pending
              </Badge>
            ) : isExpired ? (
              <Badge 
                className="absolute top-2 left-2" 
                colorScheme="red"
              >
                Expired
              </Badge>
            ) : isActive && (
              <Badge 
                className="absolute top-2 left-2" 
                colorScheme="green"
              >
                Active
              </Badge>
            )}
          </div>

          {/* Content container */}
          <div className="flex-1 p-4 flex flex-col gap-2">
            {/* Title and actions row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <Text className="text-lg font-bold font-Inter order-2 md:order-1">
                {title}
              </Text>
              <div className="flex items-center justify-between md:justify-end order-1 md:order-2">
                <Badge className="bg-yellow-400 text-white font-semibold mr-2">
                  {adCategory?.name}
                </Badge>
                <div className="flex gap-1">
                  {isExpired && (
                    <IconButton
                      icon={<RefreshCw size={16} />}
                      aria-label="Renew Ad"
                      size="sm"
                      colorScheme="green"
                      variant="ghost"
                      onClick={(e) => handleRepostClick(e, id)}
                    />
                  )}
                  <IconButton
                    icon={<Edit size={16} />}
                    aria-label="Edit"
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={(e) => handleEditClick(e, listing)}
                  />
                  <IconButton
                    icon={<Trash2 size={16} />}
                    aria-label="Delete"
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={handleDeleteClick}
                  />
                </div>
              </div>
            </div>

            {/* Description - Hidden on mobile, truncated on desktop */}
            <Text className="text-sm hidden md:block">
              {truncateDescription(description, 5)}
            </Text>

            {/* Price */}
            <Text className="text-xl font-bold text-blue-500">
              ₹{price?.toLocaleString()}
            </Text>

            {/* Stats and metadata container */}
            <div className="mt-auto flex flex-col gap-2">
              {/* Stats row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Eye size={16} />
                    <Text className="ml-1">{adViewCount}</Text>
                  </div>
                  <div className="flex items-center">
                    <Heart size={16} />
                    <Text className="ml-1">{adFavouriteCount}</Text>
                  </div>
                </div>
              </div>

              {/* Location and date */}
              <div className="flex flex-col md:flex-row md:justify-between gap-2 border-t border-gray-100">
                <div className="flex items-center">
                  <MapPin className="text-gray-500" size={16} />
                  <Text className="ml-1 text-sm text-gray-500">
                    {locationTown?.name}
                  </Text>
                </div>
                <Text className="text-sm text-gray-500">
                  Posted On: {formatDate(createdAt)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <SellModalEdit 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        listingData={selectedListing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="Listing"
        isLoading={isDeleting}
      />
    </>
  );
};

export default AdListingCardProfile;