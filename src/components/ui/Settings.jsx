import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/AuthContext';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { BASE_URL } from '../../config/config';

const Settings = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized, logout } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate("/");
    }
  }, [isInitialized, isLoggedIn, navigate]);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('UserToken');
      const response = await fetch(`${BASE_URL}/api/auth/deleteAccount`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.removeItem('UserToken');
        logout();
        navigate('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      // Here you might want to show an error message to the user
    }
  };

  const sidebarItems = [
    {
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      danger: true
    }
  ];

  // Final Confirmation Modal
  const FinalConfirmationModal = () => (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.600">
            Final Warning
          </AlertDialogHeader>

          <AlertDialogBody>
            This action is permanent and cannot be undone. Are you absolutely sure you want to delete your account?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
              Delete Anyway
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="flex min-h-screen bg-offwhite p-4 font-Inter">
      {/* Sidebar */}
      <div className="w-64 bg-offwhite shadow-sm">
        <div className="space-y-1">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              className="p-4 cursor-pointer border-b border-gray-500 hover:bg-gray-100"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-sm ${item.danger ? 'text-red-600' : 'text-black'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600">{item.subtitle}</p>
                </div>
                <ChevronRight className={`h-4 w-4 ${item.danger ? 'text-red-600' : 'text-black'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {showDeleteConfirmation && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h1 className="text-xl font-semibold mb-6 text-red-600">Delete Account</h1>
              <div className="space-y-4">
                <p className="text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                <p className="text-gray-600">All your data will be permanently removed, including:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Your profile information</li>
                  <li>Your posted ads</li>
                  <li>Your messages and chat history</li>
                  <li>Your saved items and searches</li>
                </ul>
                <div className="flex gap-4 mt-6">
                  <Button 
                    colorScheme="red"
                    onClick={onOpen}
                  >
                    Delete Account
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="min-h-screen bg-offwhite font-Inter p-2">
      {/* Mobile Navigation */}
      <div className="p-4 bg-white shadow-sm">
        <button 
          onClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
          className="text-sm font-medium text-gray-600 flex items-center justify-between w-full"
        >
          <span className="flex items-center">
            {showDeleteConfirmation && <ChevronLeft className="h-4 w-4 mr-1" />}
            {showDeleteConfirmation ? 'Back to Settings' : 'Settings'}
          </span>
          {!showDeleteConfirmation && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {!showDeleteConfirmation ? (
        // Settings Items
        <div className="p-2">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg mb-2 shadow-sm"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <div className="p-3 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`text-sm font-medium ${item.danger ? 'text-red-600' : 'text-gray-800'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${item.danger ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Delete Confirmation
        <div className="p-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <h1 className="text-lg font-semibold mb-4 text-red-600">Delete Account</h1>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                <p className="text-sm text-gray-600">All your data will be permanently removed, including:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Your profile information</li>
                  <li>Your posted ads</li>
                  <li>Your messages and chat history</li>
                  <li>Your saved items and searches</li>
                </ul>
                <div className="flex flex-col gap-2 mt-4">
                  <Button 
                    colorScheme="red"
                    width="full"
                    onClick={onOpen}
                  >
                    Delete Account
                  </Button>
                  <Button 
                    variant="outline"
                    width="full"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
      <FinalConfirmationModal />
    </>
  );
};

export default Settings;