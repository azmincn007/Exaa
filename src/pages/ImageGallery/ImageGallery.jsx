import React from 'react'
import Header from './Header'
import HomeGallery from './HomeGallery'

function ImageGallery() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto">
        <HomeGallery />
      </div>
    </div>
  )
}

export default ImageGallery
