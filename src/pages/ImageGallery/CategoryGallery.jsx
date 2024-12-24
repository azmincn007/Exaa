import { useQuery } from 'react-query';
import { BASE_URL } from '../../config/config';
import { Link } from 'react-router-dom'; // Import Link
import MarketplaceLogo from './MarketPlaceLogo';
import { useContext } from 'react';
import { SearchImageContext } from './ImageGallery';

export default function CategorySection() {
  const { searchImage } = useContext(SearchImageContext); // Fix context usage

  const { data: categories = [], isLoading, refetch } = useQuery(
    ['categories', searchImage],
    async () => {
      const url = new URL(`${BASE_URL}/api/imag-gall-cates`);
      if (searchImage) {
        url.searchParams.append('search', searchImage);
      }
      const response = await fetch(url);
      const data = await response.json();
      return data.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  );

  if (isLoading) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
          
                <div className=" md:h-[80%] my-auto w-[80%] mx-auto bg-gray-200 rounded-lg"></div>
          
        </div>
    );
}
  return (
    <div className="w-full max-w-[95%] mx-auto p-4 space-y-8 font-Inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link to={`subcategory?subcategoryId=${category.id}`} key={category.name} className="space-y-2"> {/* Wrap in Link */}
            <h2 className="text-18 font-medium px-1 ">{category.name}</h2>
            <div className="rounded-3xl overflow-hidden">
              <div className="flex">
                {category.images.map((image) => (
                  <div
                    key={image.id}
                    className={` w-full h-[150px]`}
                    style={{ backgroundImage: `url(${BASE_URL}${image.url})`, backgroundSize: 'cover' }}
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <MarketplaceLogo  />

    </div>
  )
}