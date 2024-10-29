import React, { useState, useEffect } from "react";
import { Box, Flex, Image, Text, Icon, useDisclosure } from "@chakra-ui/react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useBreakpointValue } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import LoginModal from "../../modals/Authentications/LoginModal";

// CSS for custom media queries
const styles = `
  @media (max-width: 1400px) and (min-width: 769px) {
    .location-date-container {
      flex-direction: column !important;
      gap: 0.5rem !important;
    }
    .location-text {
      max-width: 200px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const CardShowroom = ({ ad }) => {

  
  const [isAdFavourite, setIsAdFavourite] = useState(ad.isAdFavourite);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const imageUrl = Array.isArray(ad.images) ? `${BASE_URL}${ad.images[0]?.url}` : `${BASE_URL}${ad.images?.url}`;

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setIsAdFavourite(ad.isAdFavourite);
  }, [ad.isAdFavourite]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const invalidateRelatedQueries = () => {
    queryClient.invalidateQueries("recommendedAds");
    queryClient.invalidateQueries(["adsData"]);
    const currentQueries = queryClient.getQueryCache().findAll();
    currentQueries.forEach((query) => {
      if (query.queryKey[0] === "adsData") {
        queryClient.invalidateQueries(query.queryKey);
      }
    });
  };

  const addFavoriteMutation = useMutation(
    async () => {
      const token = localStorage.getItem("UserToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.post(
        `${BASE_URL}/api/ad-favourites`,
        { adId: ad.id, adCategoryId: ad.adCategory?.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        invalidateRelatedQueries();
        setIsAdFavourite(true);
      },
    }
  );

  const deleteFavoriteMutation = useMutation(
    async () => {
      const token = localStorage.getItem("UserToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.delete(`${BASE_URL}/api/ad-delete-favourite/${ad.id}/${ad.adCategory?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        invalidateRelatedQueries();
        setIsAdFavourite(false);
      },
    }
  );

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("UserToken");
    if (!token) {
      onOpen();
      return;
    }

    setIsAnimating(true);
    if (isAdFavourite) {
      deleteFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleLoginSuccess = () => {
    onClose();
    addFavoriteMutation.mutate();
  };

  const FavoriteIcon = () => (
    <Box position="relative" className={`transition-transform duration-300 ${isAnimating ? "scale-125" : "scale-100"}`} cursor="pointer" onClick={handleFavoriteClick}>
      <Icon as={isAdFavourite ? BiSolidHeart : BiHeart} w={isMobile ? 5 : 6} h={isMobile ? 5 : 6} color={isAdFavourite ? "red.500" : "gray.600"} className={isAnimating ? "animate-pulse" : ""} />
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Link to={`/details/${ad.id}/${ad.adCategory?.id}`}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="#0071BC1A" boxShadow="md" className="mb-4">
            <Box position="relative" width="100%">
              <img src={imageUrl} alt={ad.title} className="h-48 w-full rounded-t-lg" style={{ objectFit: "cover" }} />
              {ad.isAdActive && (
                <Box position="absolute" top="2" left="2" bg="#06B706" color="white" fontSize="xs" fontWeight="bold" px="2" py="1" borderRadius="md">
                  Active
                </Box>
              )}
            </Box>

            <Box p="3">
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Text className="text-lg font-bold truncate" maxW="80%">
                    {ad.title}
                  </Text>
                  <Text className="text-base font-bold mt-1">₹{ad.price.toLocaleString()}</Text>
                </Box>
                <FavoriteIcon />
              </Flex>

              <Flex justifyContent="space-between" mt="2" fontSize="xs" color="gray.500" flexWrap="wrap" gap="1">
                <Flex alignItems="center">
                  <Icon as={IoLocationOutline} mr="1" w={4} h={4} />
                  <Text className="truncate" maxW="120px">
                    {ad.locationTown.name}
                  </Text>
                </Flex>
                <Text>
                  {new Date(ad.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </Flex>
            </Box>
          </Box>
        </Link>

        <LoginModal isOpen={isOpen} onClose={onClose} onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
      <Link to={`/details/${ad.id}/${ad.adCategory?.id}`}>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="#0071BC1A" boxShadow="md">
          <Flex>
            <Box position="relative" width="40%" className="rounded-lg">
              <Image src={imageUrl} alt={ad.title} objectFit="cover" className="h-[200px] p-2 rounded-lg" h="100%" w="100%" />
              {ad.isAdActive && (
                <Box position="absolute" top="4" left="4" bg="#06B706" color="white" fontSize="xs" fontWeight="bold" px="2" py="1" borderRadius="md">
                  Active
                </Box>
              )}
            </Box>

            <Box width="60%" p="4">
              <Flex justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Text className="text-22" fontWeight="bold">
                    {ad.title}
                  </Text>
                  <Text className="text-16" fontWeight="bold" mt="2">
                    ₹{ad.price.toLocaleString()}
                  </Text>
                </Box>
                <FavoriteIcon />
              </Flex>

              <Box mt="4" fontSize="sm" color="gray.500">
                <Flex className="location-date-container" justifyContent="space-between" alignItems="flex-start">
                  <Flex alignItems="center">
                    <Icon as={IoLocationOutline} mr="1" />
                    <Text className="location-text">{ad.locationTown.name}</Text>
                  </Flex>
                  <Text whiteSpace="nowrap">
                    Posted On:{" "}
                    {new Date(ad.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Link>

      <LoginModal isOpen={isOpen} onClose={onClose} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default CardShowroom;