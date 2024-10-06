import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../../config/config';

export const useModels = (isOpen, getUserToken, brandId, subcategoryId) => {
  return useQuery(
    ['models', brandId, subcategoryId],
    async () => {
      const token = getUserToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!brandId || !subcategoryId) {
        return []; // Return empty array if no brand or subcategory is selected
      }

      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Determine the endpoint based on subcategoryId
      let endpoint;
      if (subcategoryIdString === "11") {
        endpoint = "ad-car-brand-models";
      } else if (subcategoryIdString === "12") {
        endpoint = "ad-motorcycle-bike-model";
      } else if (subcategoryIdString === "14") {
        endpoint = "ad-motorcycle-scooter-mode";
      } else if (subcategoryIdString === "15") {
        endpoint = "ad-motorcycle-scooter-model";
      } else if (subcategoryIdString === "19") {
        endpoint = "ad-com-veh-and-aut-aut-model";
      } else if (subcategoryIdString === "21") {
        endpoint = "ad-mobile-brand-models";
      } else if (subcategoryIdString === "22") {
        endpoint = "ad-mobi-mobi-bran-models";
      } else if (subcategoryIdString === "23") {
        endpoint = "ad-mobi-came-brans";
      } else {
        endpoint = "ad-car-brand-models"; // Default case
      }

      const response = await axios.get(`${BASE_URL}/api/${endpoint}/${brandId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    },
    {
      enabled: isOpen && !!brandId && !!subcategoryId,
    }
  );
};