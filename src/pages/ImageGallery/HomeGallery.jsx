// src/pages/ImageGallery/HomeGallery.jsx
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { Link } from 'react-router-dom';

function HomeGallery() {
  const { data: images = [], error } = useQuery('images', async () => {
    const response = await axios.get(`${BASE_URL}/api/find-image-gallery-home-images`);
    console.log(response.data);
    return response.data.data; // Assuming response.data is an array of image objects
  });

  if (error) {
    console.error('Error fetching images:', error);
    return <div>Error fetching images</div>; // Handle error state
  }

  return (
    <div className='bg-[#F1F1F1]  pt-16  my-8'>
      <div className='grid grid-cols-4 gap-4'>
        {images.map((image, index) => (
          <Link key={index} to={`/category/${image.id}`}>
            <img src={`${BASE_URL}/${image.url}`} alt={`Gallery Image ${index}`} className='h-full object-cover rounded-lg' />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomeGallery;