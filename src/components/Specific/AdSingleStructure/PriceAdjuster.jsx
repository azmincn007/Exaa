import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const PriceAdjuster = ({ initialPrice = 500, onSubmit, isOpen, onClose }) => {
  const [percentage, setPercentage] = useState(0);
  const adjustedPrice = initialPrice * (1 - percentage / 100);

  const handlePercentageChange = (event) => {
    setPercentage(Number(event.target.value));
  };

  const quickSelect = (value) => {
    setPercentage(value);
  };

  const handleSubmit = () => {
    onSubmit(adjustedPrice);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="sm">
        <ModalCloseButton />
        <ModalBody className="p-6 font-sans">
          <h4 className="mb-4 font-bold text-xl text-gray-800">Adjust Price</h4>
          
          <div className="flex justify-between mb-4 text-sm">
            <span className="text-gray-600">Original: ₹{initialPrice.toFixed(2)}</span>
            <span className="font-semibold text-gray-800">New: ₹{adjustedPrice.toFixed(2)}</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={percentage}
            onChange={handlePercentageChange}
            className="w-full mb-4 accent-blue-500"
          />
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">Discount: {percentage}%</span>
            <div>
              {[5, 10, 15].map((value) => (
                <button
                  key={value}
                  onClick={() => quickSelect(value)}
                  className="ml-2 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="w-full py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit Offer
          </button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PriceAdjuster;