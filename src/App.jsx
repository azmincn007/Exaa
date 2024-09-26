import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createContext, useEffect, useState } from 'react';
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

export const TownContext = createContext();
export const UserdataContext = createContext();

function App() {
  const queryClient = new QueryClient();
  const [selectedTown, setSelectedTown] = useState(localStorage.getItem('selectedTownId'));
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('UserToken'); // Ensure you have the token
        const response = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data); // Update state with fetched user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedTown) {
      localStorage.setItem('selectedTownId', selectedTown);
    }
  }, [selectedTown]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserdataContext.Provider value={{ userData, setUserData, isLoading }}>
          <TownContext.Provider value={[selectedTown, setSelectedTown]}>
            <Router>
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/packages-and-orders/:section" element={<Layout><PackagesAndOrders /></Layout>} />
                <Route path="/buy-packages/myorders" element={<BuyPackagesAndMyorders />} />
                <Route path="/category/:categoryId/:categoryName" element={<Layout><CategoryBasedGrid /></Layout>} />
                <Route path="/category/:categoryId/:categoryName/:subCategoryId" element={<Layout><CategoryBasedGrid /></Layout>} /> 
                <Route path="/details/:id/:adCategoryId" element={<Layout><SingleAd /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/profile/edit-profile" element={<Layout><EditProfile /></Layout>} />
                <Route path="/showroom" element={<Layout><Showroom /></Layout>} />
                <Route path="/my-showroom" element={<Layout><MyShowroom /></Layout>} />
                <Route path="/showroom/:id" element={<Layout><Showroomsingle /></Layout>} />
                <Route path="/my-ads" element={<Layout><MyAdsPage /></Layout>} />
                <Route path="/chats" element={<Layout><ChatComponent /></Layout>}>
                  <Route index element={<Navigate to="/chats/all" replace />} />
                  <Route path="all" element={<ChatComponent />} />
                  <Route path="buying" element={<ChatComponent />} />
                  <Route path="selling" element={<ChatComponent />} />
                </Route>
              </Routes>
            </Router>
          </TownContext.Provider>
        </UserdataContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
