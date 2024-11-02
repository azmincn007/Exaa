import React from 'react';
import { BASE_URL } from '../../../config/config';

const NearbyCard = ({ name, locationTown, locationDistrict, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600">
          {locationTown && locationDistrict ? 
            `${locationTown}, ${locationDistrict}` : 
            'Location not available'
          }
        </p>
      </div>
    </div>
  );
};

export default NearbyCard;