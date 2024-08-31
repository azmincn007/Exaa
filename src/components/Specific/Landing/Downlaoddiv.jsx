import React from 'react'
import Dow1 from '../../../assets/download1.png'
import Dow2 from '../../../assets/download2.png'
import Dow3 from '../../../assets/downlaod3.png'

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
        <h2 className='text-2xl font-bold mb-4'>Try  the Exaa APP ON</h2>
        <p>Your content goes here...</p>
      </div>
    </div>
  )
}

export default DownloadDiv