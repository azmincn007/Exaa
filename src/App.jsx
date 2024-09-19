import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

export const TownContext = createContext();

function App() {
  const queryClient = new QueryClient();
  const [selectedTown, setSelectedTown] = useState(localStorage.getItem('selectedTownId'));

  // Update localStorage when selectedTown changes
  useEffect(() => {
    if (selectedTown) {
      localStorage.setItem('selectedTownId', selectedTown);
    }
  }, [selectedTown]);


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TownContext.Provider value={[selectedTown, setSelectedTown]}>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/packages-and-orders/:section" element={<Layout><PackagesAndOrders /></Layout>} />
              <Route path="/buy-packages/myorders" element={<BuyPackagesAndMyorders />} />
              <Route path="/category/:categoryId/:categoryName" element={<Layout><CategoryBasedGrid /></Layout>} />
              <Route path="/details/:id/:adCategoryId" element={<Layout><SingleAd /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/profile/edit-profile"  element={<Layout><EditProfile /></Layout>} />
              <Route path="/showroom" element={<Layout><Showroom /></Layout>} />
              <Route path="/my-showroom" element={<Layout><MyShowroom /></Layout>} />
              <Route path="/showroom/:id" element={<Layout><Showroomsingle /></Layout>} />
              <Route path="/my-ads" element={<Layout><MyAdsPage /></Layout>} />

            </Routes>
          </Router>
        </TownContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;