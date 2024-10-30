import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { CircleCheck } from "lucide-react";
import packages from '../../assets/Packages.png'
import { BASE_URL } from "../../config/config";
import PackageGrid from "../../components/Specific/Packages/PackagesadsBoxes";
import Boostgrid from "../../components/Specific/Packages/Boostgrid";
import PackagesSkeleton from "../../components/Skelton/PackageSKelton";
import { useAuth } from "../../Hooks/AuthContext";
import { UserdataContext } from "../../App";

// Define your base URL here

// API call function
const fetchAdPackages = async () => {
  const userToken = localStorage.getItem('UserToken');
  const { data } = await axios.get(`${BASE_URL}/api/ad-subscri-packages`, {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
 
  
  return data.data;
};

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, isInitialized } = useAuth();
  const { userData } = useContext(UserdataContext);
  console.log(userData);
  

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/');
    }
  }, [isInitialized, isLoggedIn, navigate]);

  // Using React Query to fetch data
  const { data: adPackages, isLoading, isError, error } = useQuery('adPackages', fetchAdPackages);

  const isPostMoreAdsTab = location.pathname === "/packages/post-more-ads";

  const handleTabChange = (index) => {
    if (index === 0) {
      navigate("/packages/post-more-ads");
    } else {
      navigate("/packages/boost-with-tags");
    }
  };


  if (isLoading) {
    return <PackagesSkeleton />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Box mx="auto" p={6} bg="#1a2332" color="white" borderRadius="lg" boxShadow="lg" position="relative" className="mt-4 rounded-lg font-Inter w-[80%]">
      <VStack spacing={6} align="center" mb={6}>
        <Heading className="text-18 font-Inter tracking-widest font-[400]">
          Packages
        </Heading>
        <Image src={packages} className="w-[140px] h-[116px]" alt="Package icon" />
        <VStack spacing={2} align="start">
          <Flex alignItems="center" className="gap-2">
            <CircleCheck className="text-[#2DD43D]"/>
            <Text className="text-14">Here is 2 Amazing packages for you</Text>
          </Flex>
          <Flex alignItems="center " className="gap-2">
            <CircleCheck className="text-[#2DD43D]"/>
            <Text className="text-14">All Package available for 365 days</Text>
          </Flex>
          <Flex alignItems="center" className="gap-2">
            <CircleCheck className="text-[#2DD43D]"/>
            <Text className="text-14">Post more, get boosted EXXAA Profile</Text>
          </Flex>
        </VStack>
      </VStack>

      <Box bg="white" color="black" borderRadius="md" p={4}>
        <Tabs isFitted variant="unstyled" index={isPostMoreAdsTab ? 0 : 1} onChange={handleTabChange}>
          <TabList mb="1em" className="w-[40%] min-w-[300px] mx-auto border-b border-gray-200">
            <Tab 
              _selected={{ color: "blue.500", borderBottom: "2px solid currentColor" }}
              className="w-1/2 py-2 text-12 md:text-16 font-[600] text-center text-[#16273C] hover:text-gray-700"
            >
              Post more Ads
            </Tab>
            <Tab 
              _selected={{ color: "blue.500", borderBottom: "2px solid currentColor" }}
              className="w-1/2 py-2 text-12 md:text-16 font-[600] text-center text-[#16273C] hover:text-gray-700"
            >
              Boost to Top with Tags
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box mb={4}>
                <Heading className="text-16" fontWeight="semibold">
                  Post more Ads in Same Category
                </Heading>
                <Flex alignItems="center" mt={2}>
                  <Text color="#2DD43D" mr={2}>✓</Text>
                  <Text className="text-12">You can post 2 or more Ads in a particular category</Text>
                </Flex>
                <Flex alignItems="center" mt={2}>
                  <Text color="#2DD43D" mr={2}>✓</Text>
                  <Text className="text-12">Package available for 360 days</Text>
                </Flex>
              </Box>
              <PackageGrid packages={adPackages} id={userData?.id} />
            </TabPanel>
            <TabPanel>
            <Box mb={4}>
                <Heading className="text-16" fontWeight="semibold">
                  Post more Ads in Same Category
                </Heading>
                <Flex alignItems="center" mt={2}>
                  <Text color="#2DD43D" mr={2}>✓</Text>
                  <Text className="text-12">You can post 2 or more Ads in a particular category</Text>
                </Flex>
                <Flex alignItems="center" mt={2}>
                  <Text color="#2DD43D" mr={2}>✓</Text>
                  <Text className="text-12">Package available for 360 days</Text>
                </Flex>
              </Box>
              <Boostgrid packages={adPackages}  id={userData?.id} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}