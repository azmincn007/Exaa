import React, { createContext, useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './Header'
import HomeGallery from './HomeGallery'
import CategoryGallery from './CategoryGallery'
import SubCategoryGallery from './SubCatgoryGallery';
import SingleImageGallery from './SingleImageGallery';
 export const SearchImageContext = createContext();
const queryClient = new QueryClient();
function ImageGallery() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchImage, setSearchImage] = useState(''); // New state for search image
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTabIndex(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    setSearchImage('');
  }, [location.pathname]);

  const isHomeRoute = location.pathname === '/';

  return (
    <QueryClientProvider client={queryClient}>
      <SearchImageContext.Provider value={{ searchImage, setSearchImage }}>
        <div className="flex flex-col h-screen">
          <Header 
            activeTabIndex={activeTabIndex} 
            setActiveTabIndex={setActiveTabIndex} 
            isHomeRoute={isHomeRoute}
          />
          <div className="flex-1 overflow-auto mt-32 md:mt-16">
            <Routes>
              <Route index element={<HomeGallery />} />
              <Route path="image-gallery/category" element={<CategoryGallery />} />
              <Route path="image-gallery/:id" element={<SingleImageGallery />} />
              <Route path="image-gallery/category/subcategory" element={<SubCategoryGallery />} />
            </Routes>
          </div>
        </div>
      </SearchImageContext.Provider>
    </QueryClientProvider>
  )
}

export default ImageGallery
