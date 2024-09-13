import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import { MdRemoveRedEye } from 'react-icons/md';
import { CiHeart } from 'react-icons/ci';
import { useQuery } from 'react-query';
import { BASE_URL } from '../../../config/config';
import axios from 'axios';
import CarCar from '../AdSingleStructure/CarCar';
import Rest from '../AdSingleStructure/Rest';

const fetchAdData = async ({ queryKey }) => {
  const [_, adCategoryId, adId] = queryKey;
  const { data } = await axios.get(`${BASE_URL}/api/find-one-ad/${adCategoryId}/${adId}`);
  console.log(data.data);
  
  return data.data;
};

function SingleAd() {
  const { id: adId, adCategoryId } = useParams();
  const { data: adData, isLoading, error } = useQuery(
    ['adData', adCategoryId, adId],
    fetchAdData
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = adData?.images || [];
  const imageCount = images.length;

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageCount - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageCount - 1 ? 0 : prevIndex + 1));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const currentImageUrl = imageCount > 0 ? `${BASE_URL}${images[currentImageIndex].url}` : '';

  const isCarCategory = adData?.adCategory?.id === 2 && adData?.adSubCategory?.id === 11;

  return (
    <div className="my-16 font-Inter">
      <div className="relative flex items-center justify-center w-4/5  mx-auto overflow-hidden gap-16">
        <FaChevronLeft onClick={handlePrevClick} />
        {imageCount > 0 ? (
         <div className='w-full bg-black flex justify-center items-center' >
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
        <FaChevronRight onClick={handleNextClick} />
      </div>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {isCarCategory ? <CarCar adData={adData} /> : <Rest adData={adData} />}
          <div className="col-span-12 md:col-span-4 bg-white p-4 max-h-[120px]">
            <div className='h-full'>
              <div className='flex gap-4 px-4'>
                <Button className='w-full bg-blue-500 gap-2 text-white text-sm md:text-base'><MdRemoveRedEye /> {adData.adViewCount}</Button>
                <Button className='w-full bg-blue-500 gap-2 text-white text-sm md:text-base'><CiHeart /> {adData.adFavouriteCount}</Button>
              </div>
              <div className='flex justify-between items-end mt-8'>
                <p className='font-semibold'>Ad id</p>
                <p>{adData.id}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <div className='font-semibold text-lg md:text-xl'>Description</div>
          <p className='text-sm md:text-base text-gray-500'>{adData?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default SingleAd;