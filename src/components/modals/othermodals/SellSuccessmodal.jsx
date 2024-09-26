import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import sellvector from '../../../assets/SellVector.png';

const CongratulationsModal = ({ adType, onClose }) => {
    
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 flex flex-col items-center">
          <div className="bg-emerald-500 rounded-full p-3 mb-4">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-20 font-Hahmlet font-[500] text-white mb-2">Congratulations</h2>
          <p className="text-blue-400 font-Hahmlet text-14 mb-6">Your Ad will go live shortly...</p>
          
          <div className="bg-white rounded-lg p-4 w-full mb-6 font-Inter">
            <p className="text-black text-[10px] text-center mb-8">EXXAA allows 1 free Ad in 90 days for <span className='text-12 font-bold'>{adType}</span></p>
            <div className="flex items-center justify-center mb-2">
              <img src={sellvector} className='h-7 w-7' alt="" />
            </div>
            <p className="text-black text-12 font-semibold text-center">Reach more buyers and sell faster</p>
            <p className="text-black text-[10px] text-center">Upgrading an Ad helps you to reach more buyers</p>
            
            <div className='mt-4'>
              <button
                className="bg-white text-slate-800 w-full py-2 rounded-md font-semibold mb-3 hover:bg-gray-100 transition-colors border-black border-[1px] h-[40px]"
              >
                Sell Faster Now
              </button>
              <button
                className="bg-slate-700 text-white w-full py-2 rounded-md font-semibold hover:bg-slate-600 transition-colors h-[40px]"
              >
                Preview Ad
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CongratulationsModal;