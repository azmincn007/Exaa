import React from 'react';
import Dow1 from '../../../assets/download1.png';
import Dow2 from '../../../assets/download2.png';
import Dow3 from '../../../assets/downlaod3.png';
import apple from '../../../assets/apple.png';
import playstore from '../../../assets/playestore.png';

function DownloadDiv() {
  return (
    <div className='bg-exablue min-h-[300px] grid grid-cols-1 lg:grid-cols-2'>
      <div className='hidden lg:block relative h-full'>
        <img
          className='absolute top-0 left-4 w-[40%] max-w-[260px] z-20'
          src={Dow1}
          alt="Download 1"
        />
        <img
          className='absolute left-[35%] top-8 w-[40%] max-w-[260px]'
          src={Dow2}
          alt="Download 2"
        />
        <img
          className='absolute bottom-0 right-0 w-[40%] max-w-[260px]'
          src={Dow3}
          alt="Download 3"
        />
      </div>

      <div className='p-4 flex flex-col justify-center items-center text-white'>
        <h2 className='text-3xl mb-4 font-Inter'>Try the Exxaa App on</h2>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='flex gap-4 bg-black text-white px-4 py-2 rounded-lg items-center'>
            <img src={apple} alt="" className='h-[30px]' />
            <p>Download on the <br /> <span className='font-semibold'>Appstore</span></p>
          </div>
          <div className='flex gap-4 bg-black text-white px-4 py-2 rounded-lg items-center'>
            <img src={playstore} alt="" className='h-[30px]' />
            <p>Download on the <br /> <span className='font-semibold'>Play Store</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadDiv;
