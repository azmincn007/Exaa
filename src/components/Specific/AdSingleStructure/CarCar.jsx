import React from 'react';
import { BsFuelPumpFill } from 'react-icons/bs';
import { LiaTachometerAltSolid } from 'react-icons/lia';
import { GiGearStick } from 'react-icons/gi';
import { RiUserFollowFill } from 'react-icons/ri';
import { IoCalendarOutline, IoLocationSharp } from 'react-icons/io5';

const CarCar = ({ adData }) => {
  if (!adData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="col-span-12 md:col-span-8 bg-white rounded-lg p-4">
      <div>
        <div className='font-semibold text-lg md:text-2xl'>{adData.title || 'N/A'}</div>
        <div className='text-gray-500 text-sm md:text-base'>{adData.variant?.name || 'N/A'}</div>
        <div className='font-semibold my-2 text-xl md:text-2xl'>
          ₹ {new Intl.NumberFormat('en-IN').format(adData.price || 0)}
        </div>
      </div>
      <div className="flex items-center gap-4 my-4">
        <div className="flex items-center gap-2 text-gray-500">
          <BsFuelPumpFill /> {adData.fuel || 'N/A'}
        </div>
        <div className="border-l-2 border-gray-400 h-6"></div>
        <div className="flex items-center gap-2 text-gray-500">
          <LiaTachometerAltSolid /> {adData.kmDriven || 'N/A'}
        </div>
        <div className="border-l-2 border-gray-400 h-6"></div>
        <div className="flex items-center gap-2 text-gray-500">
          <GiGearStick /> {adData.transmission || 'N/A'}
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <div className="text-gray-500">
          <div className='flex gap-4'><RiUserFollowFill /> Owner</div>
          <div className='font-semibold'>{adData.noOfOwners || 'N/A'}</div>
        </div>
        <div className="border-l-2 border-gray-400 h-6"></div>
        <div className="text-gray-500">
          <div className='flex gap-4'><IoLocationSharp /> {adData.locationTown?.name || 'N/A'}</div>
          <div className='font-semibold'>{adData.locationDistrict?.name || 'N/A'}</div>
        </div>
        <div className="border-l-2 border-gray-400 h-6"></div>
        <div className="text-gray-500">
          <div className='flex gap-4'><IoCalendarOutline /> Posting date</div>
          <div className='font-semibold'>{new Date(adData.createdAt).toLocaleDateString() || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

export default CarCar;