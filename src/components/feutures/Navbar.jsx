import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, IconButton, useDisclosure, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { AiOutlineUser, AiOutlineBell } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { MdDoorSliding } from "react-icons/md";
import { BiMessage } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { IMAGES } from "../../constants/logoimg";
import { useAuth } from "../../Hooks/AuthContext";
import { UserdataContext } from "../../App";

import SearchComponent from "../Specific/Navbar/SearchComponent";
import LoginModal from "../modals/Authentications/LoginModal";
import ProfileDropdown from "../Specific/Navbar/ProfileDropdown";
import SimpleCountryDropdown from "../forms/dropdown/SimpleLocationDropdown";
import StyledLanguageDropdown from "../forms/dropdown/StyledLanguageDropdown";
import SellModal from "../modals/othermodals/SellModal";

function SkeletonNavbar() {
  // ... (keep the existing SkeletonNavbar code)
}

function Navbar({ onShowPackagesAndOrders }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileDropdownOpenMobile, setIsProfileDropdownOpenMobile] = useState(false);
  const profileDropdownRef = useRef(null);
  const profileDropdownMobileRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, logout } = useAuth();
  const { userData, isLoading } = useContext(UserdataContext);
  const navigate = useNavigate();

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
    const buttonSize = isMobile ? 'sm' : 'md';
    const isOpen = isMobile ? isProfileDropdownOpenMobile : isProfileDropdownOpen;
    const ref = isMobile ? profileDropdownMobileRef : profileDropdownRef;
    return (
      <div className="relative" ref={ref}>
        <IconButton
          aria-label="User Profile"
          icon={<AiOutlineUser className={`${isMobile ? 'text-lg' : 'text-xl'} text-white`} />}
          className="bg-[#FFFFFF1A] rounded-full"
          onClick={isMobile ? toggleProfileDropdownMobile : toggleProfileDropdown}
          size={buttonSize}
        />
        {isOpen && (
          <ProfileDropdown 
            onLogout={handleLogout} 
            onShowPackagesAndOrders={onShowPackagesAndOrders}
          />
        )}
      </div>
    );
  };

  const renderNavIcons = (isMobile) => {
    const iconSize = isMobile ? 'text-lg' : 'text-xl';
    const buttonSize = isMobile ? 'sm' : 'md';

    return (
      <>
        <IconButton 
          aria-label="showroom" 
          icon={<MdDoorSliding onClick={() => navigate('/showroom')} className={`${iconSize} text-white`} />} 
          className="bg-[#FFFFFF1A] rounded-full" 
          size={buttonSize}
        />
        <IconButton 
          aria-label="Messages" 
          icon={<BiMessage onClick={() => navigate('/chats')} className={`${iconSize} text-white`} />} 
          className="bg-[#FFFFFF1A] rounded-full" 
          size={buttonSize}
        />
        <IconButton 
          aria-label="Notifications" 
          icon={<AiOutlineBell className={`${iconSize} text-white`} />} 
          className="bg-[#FFFFFF1A] rounded-full" 
          size={buttonSize}
        />
        {renderProfileDropdown(isMobile)}
      </>
    );
  };

  if (isLoading) {
    return <SkeletonNavbar />;
  }

  return (
    <nav className="bg-exablack text-white">
      <div className="w-[90%] mx-auto py-4">
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
              <div className="flex justify-between items-center space-x-2">
                {renderNavIcons(false)}
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
            <div className="pr-1 flex gap-2 items-center">
              <FaLocationDot /> <SimpleCountryDropdown />
            </div>
            <div className="pl-1">
              <StyledLanguageDropdown />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Link to={"/"}>
              <img className="h-[30px]" src={IMAGES.ExaLogo} alt="Logo" />
            </Link>
            <div className="flex items-center space-x-1">
              {isLoggedIn ? (
                renderNavIcons(true)
              ) : (
                <Button variant="ghost" colorScheme="whiteAlpha" onClick={onLoginModalOpen} size="sm">
                  Login
                </Button>
              )}
              <Button colorScheme="blue" onClick={handleSellClick} size="sm">Sell</Button>
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