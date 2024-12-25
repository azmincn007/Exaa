import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { BASE_URL } from '../../config/config';
import { Link } from 'react-router-dom';
import MarketplaceLogo from './MarketPlaceLogo';
import { SearchImageContext } from './ImageGallery';

function HomeGallery() {
  const { searchImage } = useContext(SearchImageContext);

  const { data: images = [], error, isLoading } = useQuery(
    ['home-images', searchImage || ''],
    async () => {
      const url = new URL(`${BASE_URL}/api/find-image-gallery-home-images`);
      url.searchParams.append('search', searchImage || '');
      const response = await axios.get(url.toString());
      return response.data.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  );

  // Breakpoint configuration for responsive columns
  const breakpointColumnsObj = {

    default: 4,  // 4 columns by default

    1100: 3,    // 3 columns when screen width is 1100px or less

    700: 2,     // 2 columns when screen width is 700px or less
    500: 2      // 1 column when screen width is 500px or less
  };

  if (error) {
    console.error('Error fetching images:', error);
    return <div>Error fetching images</div>;

  }


 
  if (isLoading) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
          
                <div className=" md:h-[80%] my-auto w-[80%] mx-auto bg-gray-200 rounded-lg"></div>
          
        </div>
    );
}

  return (

    <div className='bg-[#F1F1F1] my-8 px-4'>

      <Masonry

        breakpointCols={breakpointColumnsObj}

        className="my-masonry-grid"

        columnClassName="my-masonry-grid_column"

      >

        {images.map((image, index) => (

          <div key={image.id} className="mb-6">

            <Link to={`/image-gallery/${image.imageGallerySubCategoryId}?imageId=${image.imageId}`}>

              <img 

                src={`${BASE_URL}/${image.url}`} 

                alt={`Gallery Image ${index}`} 

                className='w-full rounded-lg' 

              />

            </Link>

          </div>

        ))}
      </Masonry>


      <MarketplaceLogo  />

    </div>

  );
}


export default HomeGallery;