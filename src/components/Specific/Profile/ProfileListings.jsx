import React, { useState } from "react";
import { Box, Button, Flex, Skeleton, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";
import emptyillus from "../../../assets/empty.png";
import emptyExpiredIllus from "../../../assets/empty.png";
import AdListingCardProfile from "../../common/Cards/AdlistingCardProfile";

export const ProfileListings = ({
  userListings,
  expiredListings,
  pendingListings,
  isListingsLoading,
  isExpiredLoading,
  isPendingLoading,
  listingsError,
  expiredError,
  pendingError,
  handleEditListing,
  handleDeleteListing,
  handleRepostAd,
  handleSellClick,
}) => {
  const [visibleAds, setVisibleAds] = useState(3);
  const [activeTab, setActiveTab] = useState("active");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleShowMore = () => {
    setVisibleAds(prevVisible => prevVisible + 3);
  };

  const renderEmptyState = (type) => (
    <Flex direction="column" alignItems="center" textAlign="center" p={6} rounded="lg" shadow="sm" maxWidth="sm" mx="auto">
      <img
        src={type === 'active' ? emptyillus : emptyExpiredIllus}
        alt={`Empty ${type} ads illustration`}
        className="max-h-[200px] w-auto mb-4 md:max-h-[250px] md:max-w-[250px]"
      />
      <p className="text-gray-600 mb-4">
        {type === 'active' 
          ? "You don't have any active ads yet"
          : type === 'pending'
          ? "You don't have any pending ads"
          : "You don't have any expired ads"
        }
      </p>
      {type === 'active' && (
        <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-2 px-16 rounded">
          Start Selling
        </Button>
      )}
    </Flex>
  );

  const renderListings = (listings, type, isLoading, error) => {
    if (isLoading) {
      return <Skeleton height="200px" width="100%" />;
    }

    if (error) {
      return <Box width="100%">Error loading listings: {error.message}</Box>;
    }

    if (!listings || listings.length === 0) {
      return renderEmptyState(type);
    }

    const adListings = listings.slice(0, visibleAds).map((listing) => (
      <AdListingCardProfile
        key={listing.id}
        listing={listing}
        onEdit={() => handleEditListing(listing.id)}
        onDelete={() => handleDeleteListing(listing.id, listing.adSubCategory.id)}
        onRepost={() => handleRepostAd(listing.id)}
        isActive={type === 'active'}
        isExpired={type === 'expired'}
        isPending={type === 'pending'}
      />
    ));

    if (isMobile) {
      return (
        <Box width="100%">
          <Box 
            className="overflow-y-auto"
            style={{ maxHeight: '70vh' }}
          >
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1.5}
              pagination={{ clickable: true }}
            >
              {adListings.map((adListing, index) => (
                <SwiperSlide key={index}>
                  {adListing}
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          {renderButtons(listings)}
        </Box>
      );
    }

    return (
      <Box width="100%">
        <Box 
          className="overflow-y-auto pr-4"
          style={{ 
            maxHeight: '70vh',
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #EDF2F7',
          }}
        >
          <Flex direction="column" gap={4}>
            {adListings}
          </Flex>
        </Box>
        {renderButtons(listings)}
      </Box>
    );
  };

  const renderButtons = (listings) => (
    <Flex direction="column" gap={4} className="mt-4">
      {visibleAds < listings.length && (
        <Button onClick={handleShowMore} colorScheme="blue" variant="outline" width="100%">
          Show More
        </Button>
      )}
      {activeTab === 'active' && (
        <Button onClick={handleSellClick} colorScheme="blue" className="text-white font-medium py-2 px-16 rounded mx-auto block">
          Start Selling
        </Button>
      )}
    </Flex>
  );

  return (
    <Tabs 
      variant="soft-rounded" 
      colorScheme="blue"
      onChange={(index) => setActiveTab(index === 0 ? "active" : index === 1 ? "pending" : "expired")}
    >
      <TabList mb={4}>
        <Tab className="mr-2">Active Ads ({userListings?.length || 0})</Tab>
        <Tab className="mr-2">Pending Ads ({pendingListings?.length || 0})</Tab>
        <Tab>Expired Ads ({expiredListings?.length || 0})</Tab>
      </TabList>

      <TabPanels>
        <TabPanel padding={0}>
          {renderListings(userListings, 'active', isListingsLoading, listingsError)}
        </TabPanel>
        <TabPanel padding={0}>
          {renderListings(pendingListings, 'pending', isPendingLoading, pendingError)}
        </TabPanel>
        <TabPanel padding={0}>
          {renderListings(expiredListings, 'expired', isExpiredLoading, expiredError)}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProfileListings;