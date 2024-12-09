import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Header from './Header'
import HomeGallery from './HomeGallery'
import CategoryGallery from './CategoryGallery'
import SingleImageGallery from './SingleImageGallery';

function ImageGallery() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      <Header activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<HomeGallery />} />
          <Route path="category" element={<CategoryGallery />} />
          <Route path="category/:id" element={<SingleImageGallery />} />

        </Routes>
      </div>
    </div>
  )
}

export default ImageGallery
