import { Image } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from "../../config/config";
import { useState, useEffect, useContext } from 'react';
import Masonry from 'react-masonry-css';
import MarketplaceLogo from "./MarketPlaceLogo";
import { FaArrowRight, FaHashtag } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { SearchImageContext } from './ImageGallery';

export default function SubCategoryGallery() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subcategoryId = queryParams.get('subcategoryId');
  const { searchImage } = useContext(SearchImageContext);

  // Categories Query
  const { data: categories, isLoading: categoriesLoading } = useQuery(['categories', subcategoryId], async () => {
    const response = await axios.get(`${BASE_URL}/api/find-image-gallery-category-sub-categories/${subcategoryId}`);
    console.log(response.data.data);
    return response.data.data;
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  console.log(selectedTag?.id);
  

  // Modified Tags Query - removed initial subcategory dependency
  const { 
    data: tags = [], 
    isLoading: tagsLoading, 
    refetch: refetchTags 
  } = useQuery(
    ['tags', selectedSubcategory?.id],
    async () => {
      if (!selectedSubcategory) return [];
      const response = await axios.get(`${BASE_URL}/api/find-image-gallery-tags/${categories?.id}?imageGallerySubCategoryId=${selectedSubcategory.id}`);
      return response.data.data;
    },
    {
      enabled: !!selectedSubcategory,
    }
  );

  // Keep the useEffect for tag reset
  useEffect(() => {
    if (selectedSubcategory) {
      setSelectedTag(null);
      refetchTags();
    }
  }, [selectedSubcategory]);

  // Modified Images Query with search
  const { data: images = [], isLoading: imagesLoading } = useQuery(
    ['images', subcategoryId, selectedSubcategory?.id, selectedTag?.id, searchImage],
    async () => {
      const params = {
        search: searchImage || '',
        imageGallerySubCategoryId: selectedSubcategory?.id || '',
        imageGalleryTagId: selectedTag?.id || ''
      };
      
      console.log('Query Parameters:', params);

      const response = await axios.get(
        `${BASE_URL}/api/find-image-gallery-category-sub-categories-tags-images/${subcategoryId}`, {
          params
        }
      );
      
      console.log('API Response:', response.data.data);
      return response.data.data;
    },
    {
      enabled: true
    }
  );
  if (imagesLoading) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
          
                <div className=" md:h-[80%] my-auto w-[80%] mx-auto bg-gray-200 rounded-lg"></div>
          
        </div>
    );
}

  const colorMapping = [
    "bg-blue-100",
    "bg-orange-100",
    "bg-green-100",
    "bg-red-100",
    "bg-purple-100",
    "bg-yellow-100",
    "bg-gray-100",
  ];

  return (
    <div className="w-full max-w-[95%] mx-auto p-4 space-y-6 font-Inter">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 font-Inter">Home</span>
        <MdKeyboardArrowRight  className="text-lg text-gray-500" />
        <span className="text-sm text-gray-500 font-Inter">Category</span>
        <MdKeyboardArrowRight  className="text-lg text-gray-500" />
        <span className="font-medium font-Inter">{categories?.name}</span>
      </div> 
      <div className="flex flex-wrap gap-2">
        {categories?.imageGallerySubCategories?.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              colorMapping[index % colorMapping.length]
            } ${
              selectedSubcategory === category ? 'border-2 border-green-500' : ''
            } hover:border-2 hover:border-green-500`}
            onClick={() => setSelectedSubcategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium bg-gray-200 flex items-center gap-1 ${
              selectedTag === tag ? 'border-2 border-green-500' : ''
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            <FaHashtag className="text-gray-600" size={12} />
            {tag.name}
          </button>
        ))}
      </div>

      <Masonry
        breakpointCols={{
          default: 4,
          1100: 3,
          700: 2,
          500: 2
        }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((image, index) => (
          <div key={index} className="mb-4">
            <Link to={`/image-gallery/${image.imageGallerySubCategoryId}?imageId=${image.imageId}`}>
              <Image
                src={`${BASE_URL}${image.url}`}
                alt={image.title || 'Gallery Image'}
                className="w-full h-auto rounded-lg"
              />
            </Link>
          </div>
        ))}
      </Masonry>
      <MarketplaceLogo />
    </div>
  );
}