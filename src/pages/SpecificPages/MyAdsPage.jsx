import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, Skeleton, Box, Text, Image, Stack } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import FavoriteCard from '../../components/common/Cards/FavouriteCard';
import AdListing from '../../components/common/Cards/AdlistingCard';
import emptyIllus from '../../assets/empty.png';

function SkeletonCard() {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Skeleton height="200px" />
      <Box p="6">
        <Skeleton height="20px" width="60%" mb="2" />
        <Skeleton height="16px" width="80%" mb="2" />
        <Skeleton height="16px" width="40%" />
      </Box>
    </Box>
  );
}

function EmptyState({ message }) {
  return (
    <Box textAlign="center" mt="10">
      <Image src={emptyIllus} alt="No content" boxSize="200px" mx="auto" mb="4" />
      <Text className='font-Inter' fontSize="xl">{message}</Text>
    </Box>
  );
}

function MyAdsPage() {
  const queryClient = useQueryClient();

  // Query for user ads
  const { data: userAds, isLoading: isLoadingUserAds, error: userAdsError } = useQuery('userAds', async () => {
    const token = localStorage.getItem('UserToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${BASE_URL}/api/find-user-ads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response.data.data);
    
    return response.data.data;
  });

  // Query for favorite ads
  const { data: favoriteAds, isLoading: isLoadingFavorites, error: favoritesError } = useQuery('favoriteAds', async () => {
    const token = localStorage.getItem('UserToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await axios.get(`${BASE_URL}/api/find-user-favourite-ads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  });

  const unfavoriteMutation = useMutation(
    async ({ id, adCategoryId }) => {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await axios.delete(
        `${BASE_URL}/api/ad-delete-favourite/${id}/${adCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    },
    {
      onMutate: ({ id }) => {
        const previousFavorites = queryClient.getQueryData('favoriteAds');
        queryClient.setQueryData('favoriteAds', (oldData) => 
          oldData.filter(ad => ad.id !== id)
        );
        return { previousFavorites };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData('favoriteAds', context.previousFavorites);
      },
      onSettled: () => {
        queryClient.invalidateQueries('favoriteAds');
      },
    }
  );

  const handleUnfavorite = (id, adCategoryId) => {
    unfavoriteMutation.mutate({ id, adCategoryId });
  };

  const renderUserAds = () => {
    if (isLoadingUserAds) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (userAdsError) {
      return <Text fontSize="xl" textAlign="center">Error loading user ads: {userAdsError.message}</Text>;
    }

    if (!userAds || userAds.length === 0) {
      return <EmptyState message="You haven't posted any ads yet" />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userAds.map((ad) => (
          <AdListing
            key={ad.id}
            isActive={ad.isActive}
            image={ad.images.url}
            title={ad.title}
            year={ad.year}
            fuelType={ad.fuelType}
            kilometers={ad.kilometers}
            description={ad.description}
            price={ad.price}
            views={ad.adViewCount}
            likes={ad.likes}
            location={ad.locationTown?.name || 'Unknown'}
            postedDate={new Date(ad.createdAt).toLocaleDateString()}
            category={ad.adCategory?.name || 'Uncategorized'}
          />
        ))}
      </div>
    );
  };

  const renderFavorites = () => {
    if (isLoadingFavorites) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }

    if (favoritesError) {
      if (favoritesError.response && favoritesError.response.status === 404) {
        return <EmptyState message="You haven't added any favorites yet" />;
      }
      return <Text fontSize="xl" textAlign="center">Error loading favorite ads: {favoritesError.message}</Text>;
    }

    if (!favoriteAds || favoriteAds.length === 0) {
      return <EmptyState message="You haven't added any favorites yet" />;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {favoriteAds.map((ad) => (
          <FavoriteCard
            key={ad.id}
            id={ad.id}
            adCategoryId={ad.adCategory.id}
            adSubCategoryId={ad.adSubCategory.id}
            isFeatured={ad.isFeatured}
            imageUrl={ad.images?.url}
            price={ad.price}
            title={ad.title}
            location={ad.locationTown.name}
            postedDate={ad.postedDate}
            adBoostTag={ad.adBoostTag}
            onUnfavorite={handleUnfavorite}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Tabs className="py-0 md:py-4 w-[92%] md:w-[88%] lg:w-[85%] mx-auto">
        <TabList className="bg-white">
          <Tab _selected={{ color: "white", bg: "blue.500", rounded: '8px' }} bg="white" color="black" className="flex-1">
            Ads
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500", rounded: '8px' }} bg="white" color="black" className="flex-1">
            Favourites
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel className='px-0 md:px-4 mt-4'>
            {renderUserAds()}
          </TabPanel>
          <TabPanel className='px-0 md:px-4 mt-4'>
            {renderFavorites()}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default MyAdsPage;