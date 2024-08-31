import React from 'react';
import { Card, CardBody, Image } from '@chakra-ui/react';
import { BiHeart } from 'react-icons/bi';
import { BASE_URL } from '../../../config/config';

function CardUser({ imageUrl, price, title, location, postedDate, adBoostTag }) {
  const completeImageUrl = `${BASE_URL}${imageUrl}`;
  console.log('Complete Image URL:', completeImageUrl);

  const isFeatured = adBoostTag === "Featured";

  return (
    <Card maxW='300px' className='overflow-hidden shadow-md relative'>
      {isFeatured && <div className='absolute left-0 bottom-0 w-1 h-[100px] bg-[#FFCE32]'></div>}
      <CardBody className='p-2 '>
        <div className='relative'>
          <Image
            src={completeImageUrl}
            alt={title}
            height='170px'
            width='100%'
            objectFit='cover'
          />
          {isFeatured && (
            <div className='absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center'>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              FEATURED
            </div>
          )}
          <div className='absolute top-2 right-2 bg-white p-1.5 rounded-full'>
            <BiHeart className="w-5 h-5 text-gray-600" />
          </div>
        </div>
        <div className='p-3'>
          <p className='font-bold text-xl'>₹ {price}</p>
          <p className='text-gray-700 whitespace-nowrap overflow-hidden text-overflow-ellipsis'>{title}</p>
          <div className='mt-2 flex justify-between text-xs text-gray-500'>
            <p>{location}</p>
            <p>6 days Ago</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default CardUser;