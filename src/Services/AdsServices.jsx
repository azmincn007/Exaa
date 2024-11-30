import axios from 'axios'; 
import { BASE_URL } from '../config/config';

export const AdsService = {
   fetchSubCategories: async (categoryId) => {
     try {
       const response = await axios.get(`${BASE_URL}/api/ad-find-category-sub-categories/${categoryId}`);
       console.log('Fetched subCategories:', response.data.data);
       return response.data.data;
     } catch (error) {
       console.error('Error fetching subcategories:', error);
       throw error;
     }
   },
   
   fetchAdsData: async (params) => {
     const {
       subCategoryId,
       selectedTownId,
       selectedDistrictId,
       search,
       filters,
       sortOption = ''
     } = params;

     // Retrieve UserToken from localStorage
     const UserToken = localStorage.getItem('UserToken');

     try {
       let url = `${BASE_URL}/api/find-sub-category-ads/${subCategoryId}?locationDistrictId="${selectedDistrictId}"&locationTownId="${selectedTownId}"&sort=`;
       
       // Set up headers for the request
       const headers = {};
       if (UserToken) {
         headers.Authorization = `Bearer ${UserToken}`;
       }

       // Helper function to add filter parameters
       const addFilterParams = (filterKey, value) => {
         if (Array.isArray(value) && value.length > 0) {
           return value.map(v => `${filterKey}=${encodeURIComponent(v)}`).join('&');
         } else if (value !== null && value !== undefined) {
           return `${filterKey}=${encodeURIComponent(value)}`;
         }
         return '';
       };

       // Add all filter parameters
       const filterParams = Object.entries(filters)
         .map(([key, value]) => addFilterParams(key, value))
         .filter(Boolean)
         .join('&');

       if (filterParams) {
         url += `&${filterParams}`;
       }

       // Log the URL before making the API call
       console.log('Fetching ads with URL:', url);

       const response = await axios.get(url, { headers });
       return response.data;
     } catch (error) {
       console.error('Error fetching ads data:', error);
       throw error;
     }
   }
};

export default AdsService;