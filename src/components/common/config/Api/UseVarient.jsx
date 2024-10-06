import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../../config/config';

export const useVariants = (isOpen, getUserToken, modelId, subcategoryId) => {
  return useQuery(
    ['variants', modelId, subcategoryId],
    async () => {
      const token = getUserToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!modelId || !subcategoryId) {
        return []; // Return empty array if no model or subcategory is selected
      }

      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Determine the endpoint based on subcategoryId
      let endpoint;
      if (subcategoryIdString === "11") {
        endpoint = "ad-car-model-variants";
      } else if (subcategoryIdString === "12") {
        endpoint = "ad-motorcycle-bike-variant";
      } else if (subcategoryIdString === "14") {
        endpoint = "ad-motorcycle-scooter-variant";
      } else if (subcategoryIdString === "15") {
        endpoint = "ad-motorcycle-scooter-variant";
      } else if (subcategoryIdString === "19") {
        endpoint = "ad-com-veh-and-aut-aut-variant";
      } else if (subcategoryIdString === "21") {
        endpoint = "ad-mobile-model-variants";
      } else if (subcategoryIdString === "22") {
        endpoint = "ad-mobi-mobi-model-variants";
      } else if (subcategoryIdString === "23") {
        endpoint = "ad-mobi-came-model-variants";
      } else {
        endpoint = "ad-car-model-variants"; // Default case
      }

      const response = await axios.get(`${BASE_URL}/api/${endpoint}/${modelId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    },
    {
      enabled: isOpen && !!modelId && !!subcategoryId,
    }
  );
};