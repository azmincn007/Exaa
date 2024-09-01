import React, { useState, useEffect, useRef } from 'react'
import { CountryDropDown, LanguageDropDown } from '../Specific/Navbar/NavBarDropdowns'
import { Button, IconButton, useDisclosure } from '@chakra-ui/react'
import { AiOutlineMenu, AiOutlineClose, AiOutlineUser, AiOutlineBell, AiOutlineMail, AiOutlineHeart } from 'react-icons/ai'
import SearchComponent from '../Specific/Navbar/SearchComponent'
import LoginModal from '../modals/Authentications/LoginModal'
import { IMAGES } from '../../constants/logoimg'
import ProfileDropdown from '../Specific/Navbar/ProfileDropdown'
import { useAuth } from '../../Hooks/AuthContext'

function Navbar({onShowPackagesAndOrders}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)
  const { isLoggedIn, logout } = useAuth() // Use the auth context

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileDropdownRef])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleLogout = () => {
    logout() // Use the logout function from context
    setIsProfileDropdownOpen(false)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  return (
    <div className={`bg-exablack text-white py-4 transition-all duration-300 ease-in-out`}>
      <div className='w-[90%] mx-auto'>
        <div className='grid grid-cols-12 gap-4 items-center'>
          <div className='col-span-2 md:col-span-1'>
            <img className='h-[40px]' src={IMAGES.ExaLogo} alt="Logo" />
          </div>
          
          <div className='hidden md:block col-span-2'>
            <CountryDropDown/>
          </div>
          
          <div className='col-span-6 md:col-span-3'>
            <SearchComponent/>
          </div>
          
          <div className='hidden md:block col-span-2'>
            <LanguageDropDown/>
          </div>
          
          <div className='col-span-2 text-center hidden md:block'>
            {isLoggedIn ? (
              <div className="flex justify-end items-center space-x-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                  <AiOutlineHeart className="text-xl" />
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                  <AiOutlineMail className="text-xl" />
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                  <AiOutlineBell className="text-xl" />
                </div>
                <div className="relative" ref={profileDropdownRef}>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10"
                    onClick={toggleProfileDropdown}
                  >
                    <AiOutlineUser className="text-xl" />
                  </div>
                  {isProfileDropdownOpen && <ProfileDropdown onLogout={handleLogout} onShowPackagesAndOrders={onShowPackagesAndOrders} />}
                </div>
              </div>
            ) : (
              <span className='text-lg underline cursor-pointer' onClick={onOpen}>Login Now</span>
            )}
          </div>
          
          <div className='hidden md:block col-span-2'>
            <Button className="w-full bg-exablue text-white text-lg px-4">Sell</Button>
          </div>
          
          <div className='col-span-2 md:hidden text-right'>
            <IconButton
              icon={isExpanded ? <AiOutlineClose /> : <AiOutlineMenu />}
              onClick={toggleExpand}
              aria-label="Toggle menu"
              variant="outline"
              color="white"
            />
          </div>
        </div>
      </div>
      
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className='container mx-auto px-4 mt-4 space-y-4'>
          <CountryDropDown/>
          <LanguageDropDown/>
          {isLoggedIn ? (
            <div className="flex justify-center space-x-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                <AiOutlineHeart className="text-xl" />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                <AiOutlineMail className="text-xl" />
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10">
                <AiOutlineBell className="text-xl" />
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-white bg-opacity-10"
                onClick={handleLogout}
              >
                <AiOutlineUser className="text-xl" />
              </div>
            </div>
          ) : (
            <div className='text-xl underline cursor-pointer text-center' onClick={onOpen}>Login Now</div>
          )}
          <Button className="w-full bg-exablue text-white text-lg px-4">Sell</Button>
        </div>
      </div>
      
      <LoginModal isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export default Navbar