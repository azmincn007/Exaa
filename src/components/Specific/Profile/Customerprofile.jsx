import React, { useState } from 'react';
import { Mail, MapPin, Phone, Share2, Copy } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Card, CardBody, CardHeader, Collapse, useToast } from '@chakra-ui/react';
import { UserdataContext } from '../../../App';
import { BASE_URL } from '../../../config/config';

const CustomerProfileComponent = ({sellerName, sellerPhone, sellerProfile}) => {
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const toast = useToast();

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copied!",
        status: "success",
        duration: 2000,
        position: "top",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy link",
        status: "error",
        duration: 2000,
        position: "top",
      });
    });
  };

  const handleWhatsAppShare = () => {
    const currentUrl = window.location.href;
    const shareText = `Check out this seller profile: ${sellerName}\n${currentUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src={`${BASE_URL}${sellerProfile}`}
                alt={sellerName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-20 font-bold">
                {sellerName}
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                <Phone size={20} />
              </div>
              <span className="text-sm">{sellerPhone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-gray-500">
                <MapPin size={20} />
              </div>
              {/* <span className="text-sm">{userData?.userlocation}</span> */}
            </div>
            
            {/* Share button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsShareExpanded(!isShareExpanded)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Share Options Collapse */}
            <Collapse in={isShareExpanded}>
              <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 space-y-2">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  >
                    <FaWhatsapp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Share on WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Copy Link</span>
                  </button>
                </div>
              </div>
            </Collapse>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerProfileComponent;
