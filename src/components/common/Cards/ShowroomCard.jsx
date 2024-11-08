import React from 'react';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@chakra-ui/react';
import { Eye, Heart, MapPin, Calendar } from 'lucide-react';

const ShowroomCard = ({ showroomData, otherAds, visibleCards, loadMore }) => {
  const imageUrl = showroomData?.images && showroomData.images.length > 0
    ? `${BASE_URL}${showroomData.images[0].url}`
    : '/api/placeholder/800/400';

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{showroomData?.name || 'Showroom'}</CardTitle>
        </CardHeader>
        <CardContent>
          <img 
            src={imageUrl} 
            alt="Showroom image" 
            className="w-full h-64 object-cover rounded-md mb-4" 
          />
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary">{showroomData?.adCategory?.name || 'Category'}</Badge>
            <Badge variant="outline">{showroomData?.adShowroomCategory?.name || 'Showroom Category'}</Badge>
          </div>
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-4">All Ads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherAds.slice(0, visibleCards).map((ad) => (
              <Card key={ad.id} className="overflow-hidden">
                <img 
                  src={`${BASE_URL}${ad.images.url}`} 
                  alt={ad.title} 
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{ad.title}</h3>
                  {ad.price ? <p className="text-sm text-gray-600 mb-2">${ad.price}</p> : <p className="text-sm text-green-500 mb-2">Service</p>}
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span className="flex items-center"><MapPin size={12} className="mr-1" />{ad.locationTown.name}</span>
                    <span className="flex items-center"><Calendar size={12} className="mr-1" />{new Date(ad.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-2 flex justify-between">
                  <span className="flex items-center text-xs"><Eye size={12} className="mr-1" />{ad.views}</span>
                  <span className="flex items-center text-xs"><Heart size={12} className="mr-1" />{ad.likes}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {visibleCards < otherAds.length && (
            <Button onClick={loadMore} variant="outline">
              Load More
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ShowroomCard;