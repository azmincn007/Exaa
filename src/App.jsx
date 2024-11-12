import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createContext, useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './Hooks/AuthContext';
import Layout from './pages/Layout';
import SingleAd from './components/Specific/Landing/SingleAd';
import PackagesAndOrders from './pages/SpecificPages/PackagesandOrders';
import BuyPackagesAndMyorders from './pages/SpecificPages/BuyPackagesAndMyorders';
import Profile from './pages/SpecificPages/Profile';
import EditProfile from './pages/SpecificPages/EditProfile';
import MyShowroom from './pages/SpecificPages/MyShowroom';
import Showroom from './pages/SpecificPages/Showroom';
import Showroomsingle from './pages/SpecificPages/Showroomsingle';
import MyAdsPage from './pages/SpecificPages/MyAdsPage';
import CategoryBasedGrid from './components/Specific/Landing/CategoryBasedGrid';
import ChatComponent from './pages/SpecificPages/Chatcomponent';
import axios from 'axios';
import { BASE_URL } from './config/config';
import { SearchProvider } from './Hooks/SearchContext';
import Packages from './pages/SpecificPages/Packages';
import PaymentButton from './Services/RazorpayPayment';
import CustomerProfile from './pages/SpecificPages/CustomerProfile';
import LocationSelects from './components/modals/Authentications/LocationSelects';
import HelpAndSupport from './components/ui/HelpAndSupport';
import Settings from './components/ui/Settings';
import AdPreviewPage from './components/Specific/Landing/AdPreviewPage';

export const TownContext = createContext();
export const UserdataContext = createContext();

export const DistrictContext = createContext();
export const UserDataRefetchContext = createContext();

function App() {
  const queryClient = new QueryClient();
  const [selectedTown, setSelectedTown] = useState(localStorage.getItem('selectedTownId'));
  const [selectedDistrict, setSelectedDistrict] = useState(localStorage.getItem('selectedDistrictId'));
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

 

  

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('UserToken');
      if (!token) {
        setUserData(null);
        return;
      }
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (selectedTown) {
      localStorage.setItem('selectedTownId', selectedTown);
    }
  }, [selectedTown]);

  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem('selectedDistrictId', selectedDistrict);
    }
  }, [selectedDistrict]);


  useEffect(() => {
    if (selectedTown) {
      localStorage.setItem('selectedTownId', selectedTown);
    }
  }, [selectedTown]);

  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem('selectedDistrictId', selectedDistrict);
    }
  }, [selectedDistrict]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <UserdataContext.Provider value={{ userData, setUserData, isLoading }}>
            <UserDataRefetchContext.Provider value={fetchUserData}>
              <DistrictContext.Provider value={[selectedDistrict, setSelectedDistrict]}>
                <TownContext.Provider value={[selectedTown, setSelectedTown]}>
                  <Router>
                    <Routes>
                      <Route path="/" element={<Layout searchType="home"><Home /></Layout>} />
                      <Route path="/packages-and-orders/:section" element={<Layout><PackagesAndOrders /></Layout>} />
                      <Route path="/packages" element={<Layout><Packages /></Layout>}>
                        <Route index element={<Navigate to="/packages/post-more-ads" replace />} />
                        <Route path="post-more-ads" element={<Packages />} />
                        <Route path="boost-with-tags" element={<Packages />} />
                      </Route>
                      <Route path="/buy-packages/myorders" element={<BuyPackagesAndMyorders />} />
                      <Route path="/category/:categoryId/:categoryName" element={<Layout><CategoryBasedGrid /></Layout>} />
                      <Route path="/category/:categoryId/:categoryName/:subCategoryId" element={<Layout><CategoryBasedGrid /></Layout>} />
                      <Route path="/item" element={<Layout><SingleAd /></Layout>} />                      <Route path="/profile" element={<Layout><Profile /></Layout>} />
                      <Route path="/profile/edit-profile" element={<Layout><EditProfile /></Layout>} />
                      <Route path="/showroom" element={<Layout><Showroom /></Layout>} />
                      <Route path="/my-showroom" element={<Layout><MyShowroom /></Layout>} />
                      <Route path="/showroom/:id" element={<Layout><Showroomsingle /></Layout>} />
                      <Route path="/customer-profile/:customerId" element={<Layout><CustomerProfile /></Layout>} />
                      <Route path="/help-and-support" element={<Layout><HelpAndSupport /></Layout>} />
                      <Route path="/settings" element={<Layout><Settings /></Layout>} />
                      <Route path="/my-ads" element={<Layout><MyAdsPage /></Layout>} />
                      <Route path="/chats" element={<Layout><ChatComponent /></Layout>}>
                        <Route index element={<Navigate to="/chats/all" replace />} />
                        <Route path="all" element={<ChatComponent />} />
                        <Route path="buying" element={<ChatComponent />} />
                        <Route path="selling" element={<ChatComponent />} />
                      </Route>
                      <Route path="payment" element={<PaymentButton />} />
                      <Route path="test" element={<LocationSelects />} />
                      <Route path="/ad-preview" element={<Layout><AdPreviewPage /></Layout>} />
                    </Routes>
                  </Router>
                </TownContext.Provider>
              </DistrictContext.Provider>
            </UserDataRefetchContext.Provider>
          </UserdataContext.Provider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
