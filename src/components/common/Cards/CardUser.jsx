import React, { useState, useEffect } from 'react';
import { Card, CardBody, Image, useDisclosure } from '@chakra-ui/react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';
import LoginModal from '../../modals/Authentications/LoginModal';
import AdBoostBadge from '../buttons/AdBoostBadge';

function CardUser({ id, imageUrl, price, title, location, postedDate, adBoostTag, adCategoryId, isAdFavourite: initialIsAdFavourite }) {
  const [isAdFavourite, setIsAdFavourite] = useState(initialIsAdFavourite);

  const [isAnimating, setIsAnimating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isFeatured = adBoostTag === "Featured";
  const queryClient = useQueryClient();

  


  useEffect(() => {
    setIsAdFavourite(initialIsAdFavourite);
  }, [initialIsAdFavourite]);

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries('recommendedAds');
    queryClient.invalidateQueries(['adsData']);
    const currentQueries = queryClient.getQueryCache().findAll();
    currentQueries.forEach(query => {
      if (query.queryKey[0] === 'adsData') {
        queryClient.invalidateQueries(query.queryKey);
      }
    });
  };

  const addFavoriteMutation = useMutation(
    async () => {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.post(
        `${BASE_URL}/api/ad-favourites`,
        { adId: id, adCategoryId: adCategoryId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        invalidateRelatedQueries();
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
        `${BASE_URL}/api/ad-delete-favourite/${id}/${adCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        invalidateRelatedQueries();
        setIsAdFavourite(false);
      },
    }
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('UserToken');
    if (!token) {
      // Open the login modal instead of showing an alert
      onOpen();
      return;
    }

    setIsAnimating(true);
    if (isAdFavourite) {
      deleteFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Callback for when login is successful
  const handleLoginSuccess = () => {
    onClose(); // Close the login modal
    // Attempt to add to favorites after successful login
    addFavoriteMutation.mutate();
  };

  const renderPriceOrService = () => {
    if (price) {
      return <p className='font-bold text-xl'>₹ {price}</p>;
    } else {
      return <p className='font-bold text-16 text-green-600'>Service</p>;
    }
  };

  return (
    <>
      <Link to={`/details/${id}/${adCategoryId}`} className="block">
        <Card maxW='300px' className='overflow-hidden shadow-md relative cardUser'>
          {adBoostTag && <div className='absolute left-0 bottom-0 w-1 h-[100px] bg-[#FFCE32]'></div>}
          <CardBody className='p-2'>
            <div className='relative'>
              <Image
                src={`${BASE_URL}${imageUrl}`}
                alt={title}
                height='170px'
                width='100%'
                objectFit='cover'
              />
              {adBoostTag && <AdBoostBadge tag={adBoostTag} />}
              <div
                className={`absolute top-2 right-2 bg-white p-1.5 rounded-full cursor-pointer transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}
                onClick={handleFavoriteClick}
              >
                {isAdFavourite ? (
                  <BiSolidHeart className={`w-5 h-5 text-red-500 ${isAnimating ? 'animate-pulse' : ''}`} />
                ) : (
                  <BiHeart className={`w-5 h-5 text-gray-600 ${isAnimating ? 'animate-pulse' : ''}`} />
                )}
              </div>
            </div>
            <div className='p-3 font-Roboto'>
              {renderPriceOrService()}
              <p className='text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis font-[400] font-Roboto text-[#002F34A3] tracking-widest'>{title}</p>
              <div className='mt-2 flex justify-between text-xs text-gray-500'>
                <p className='tracking-wide'>{location}</p>
                <p>{postedDate}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isOpen} 
        onClose={onClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default CardUser;
