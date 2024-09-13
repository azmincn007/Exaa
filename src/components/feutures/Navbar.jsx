import React, { useState, useEffect, useRef } from "react";
import { Button, IconButton, Select, useDisclosure, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { AiOutlineUser, AiOutlineBell, AiOutlineMail, AiOutlineHeart } from "react-icons/ai";
import { useQuery } from "react-query";
import axios from "axios";
import SearchComponent from "../Specific/Navbar/SearchComponent";
import LoginModal from "../modals/Authentications/LoginModal";
import { IMAGES } from "../../constants/logoimg";
import ProfileDropdown from "../Specific/Navbar/ProfileDropdown";
import { useAuth } from "../../Hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import SimpleCountryDropdown from "../forms/dropdown/SimpleLocationDropdown";
import { FaLocationDot } from "react-icons/fa6";
import StyledLanguageDropdown from "../forms/dropdown/StyledLanguageDropdown";
import { BASE_URL } from "../../config/config";
import SellModal from "../modals/othermodals/SellModal";
import { FaCar } from "react-icons/fa";
import { MdDoorSliding } from "react-icons/md";

// Custom hook for fetching user data
const useUserData = (isLoggedIn) => {
  return useQuery(
    "userData",
    async () => {
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
        },
      });
      console.log(response.data);
      return response.data.data;
    },
    {
      enabled: isLoggedIn,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

function SkeletonNavbar() {
  return (
    <nav className="bg-exablack text-white">
      <div className="w-[90%] lg:w-[90%] mx-auto py-4">
        {/* Large screens layout (above 900px) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2 lg:col-span-1">
            <Skeleton height="40px" width="100px" />
          </div>
          <div className="col-span-4">
            <Skeleton height="40px" />
          </div>
          <div className="col-span-3 flex gap-2 items-center justify-around">
            <Skeleton height="30px" width="150px" />
            <Skeleton height="30px" width="100px" />
          </div>
          <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center">
            <div className="flex justify-between items-center space-x-2">
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Skeleton height="40px" />
          </div>
        </div>
        
        {/* Small screens and tablet layout (below 900px) */}
        <div className="lg:hidden flex flex-col space-y-4">
          <div className="flex justify-end items-center mb-2">
            <Skeleton height="30px" width="100px" className="mr-2" />
            <Skeleton height="30px" width="100px" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton height="40px" width="100px" />
            <div className="flex items-center space-x-2">
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
              <SkeletonCircle size="10" />
              <Skeleton height="40px" width="60px" />
            </div>
          </div>
          <div className="w-full">
            <Skeleton height="40px" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Navbar({ onShowPackagesAndOrders }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileDropdownOpenMobile, setIsProfileDropdownOpenMobile] = useState(false);
  const profileDropdownRef = useRef(null);
  const profileDropdownMobileRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, logout } = useAuth();
  const navigate=useNavigate();

  // Fetch user data using the custom hook
  const { data: userData, isLoading: isUserDataLoading } = useUserData(isLoggedIn);
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure();
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose } = useDisclosure();
  const handleSellClick = () => {
    if (isLoggedIn) {
      onSellModalOpen();
    } else {
      onLoginModalOpen();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = !(
        (profileDropdownRef.current && profileDropdownRef.current.contains(event.target)) ||
        (profileDropdownMobileRef.current && profileDropdownMobileRef.current.contains(event.target))
      );
      if (isOutsideClick) {
        setIsProfileDropdownOpen(false);
        setIsProfileDropdownOpenMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsProfileDropdownOpenMobile(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    setIsProfileDropdownOpenMobile(false);
  };

  const toggleProfileDropdownMobile = () => {
    setIsProfileDropdownOpenMobile((prev) => !prev);
    setIsProfileDropdownOpen(false);
  };

  const renderProfileDropdown = (isMobile) => {
    const isOpen = isMobile ? isProfileDropdownOpenMobile : isProfileDropdownOpen;
    const ref = isMobile ? profileDropdownMobileRef : profileDropdownRef;
    return (
      <div className="relative" ref={ref}>
        <IconButton
          aria-label="User Profile"
          icon={<AiOutlineUser className="text-xl text-white" />}
          className="bg-[#FFFFFF1A] rounded-full"
          onClick={isMobile ? toggleProfileDropdownMobile : toggleProfileDropdown}
        />
        {isOpen && (
          <ProfileDropdown 
            onLogout={handleLogout} 
            onShowPackagesAndOrders={onShowPackagesAndOrders}
            userData={userData}
           
          />
        )}
      </div>
    );
  };

  // If the user data is loading, render the skeleton
  if (isUserDataLoading) {
    return <SkeletonNavbar />;
  }

  return (
    <nav className="bg-exablack text-white">
      <div className="w-[90%] lg:w-[90%] mx-auto py-4">
        {/* Large screens layout (above 900px) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
          <div className="col-span-2 lg:col-span-1">
            <Link to={"/"}>
              <img className="h-[40px]" src={IMAGES.ExaLogo} alt="Logo" />
            </Link>
          </div>
          <div className="col-span-4">
            <SearchComponent />
          </div>
          <div className="col-span-3 flex gap-2 items-center justify-around">
            <div className="flex items-center gap-4">
              <FaLocationDot /> <SimpleCountryDropdown />
            </div>
            <div className="flex">
              <StyledLanguageDropdown />
            </div>
          </div>
          <div className="col-span-3 md:col-span-2 lg:col-span-2 text-center">
            {isLoggedIn ? (
              <div className="flex justify-between items-center space-x-0">
                <IconButton aria-label="showroom" icon={<MdDoorSliding  onClick={()=>navigate('/showroom')} className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                <IconButton aria-label="Messages" icon={<AiOutlineMail className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                <IconButton aria-label="Notifications" icon={<AiOutlineBell className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                {renderProfileDropdown(false)}
              </div>
            ) : (
              <span className="text-lg underline cursor-pointer" onClick={onLoginModalOpen}>
              Login Now
            </span>
            )}
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Button colorScheme="blue" className="w-full" onClick={handleSellClick}>
  Sell
</Button>
          </div>
        </div>
        
        {/* Small screens and tablet layout (below 900px) */}
        <div className="lg:hidden flex flex-col space-y-4">
          <div className="flex justify-end items-center mb-2">
            <div className="pr-1">
              <Select variant="unstyled" placeholder="location" />
            </div>
            <div className="pl-1">
              <Select variant="unstyled" placeholder="language" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link to={"/"}>
              <img className="h-[40px]" src={IMAGES.ExaLogo} alt="Logo" />
            </Link>
            <div className="flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <IconButton aria-label="Favorites" icon={<MdDoorSliding  className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                  <IconButton aria-label="Messages" icon={<AiOutlineMail className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                  <IconButton aria-label="Notifications" icon={<AiOutlineBell className="text-xl text-white" />} className="bg-[#FFFFFF1A] rounded-full" />
                  {renderProfileDropdown(true)}
                </>
              ) : (
                <Button variant="ghost" colorScheme="whiteAlpha" onClick={onLoginModalOpen}>
                Login
              </Button>
              )}
              <Button colorScheme="blue">Sell</Button>
            </div>
          </div>
          <div className="w-full">
            <SearchComponent />
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={onLoginModalClose} />
      <SellModal isOpen={isSellModalOpen} onClose={onSellModalClose} />
    </nav>
  );
}

export default Navbar;