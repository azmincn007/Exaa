import React from 'react';
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardBody, CardHeader } from '@chakra-ui/react';
import { UserdataContext } from '../../../App';
import { BASE_URL } from '../../../config/config';

const CustomerProfileComponent = ({sellerName,sellerPhone,sellerProfile}) => {

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              <img
                src={`${BASE_URL}${sellerProfile}`}
              
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
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerProfileComponent;