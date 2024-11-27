import { useQuery } from 'react-query';
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useModels = (isOpen, getUserToken, brandId, subcategoryId, selectedTypeId) => {
  return useQuery(
    ["models", brandId, subcategoryId, selectedTypeId], // Include selectedTypeId in query key
    async () => {
      const token = getUserToken();
     

      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Special handling for subcategory 18
      if (subcategoryIdString === "18") {
        if (!selectedTypeId) {
          throw new Error("Type ID is required for commercial vehicles");
        }
        if (!brandId) {
          throw new Error("Brand ID is required for commercial vehicles");
        }
        const response = await axios.get(
          `${BASE_URL}/api/ad-com-veh-and-aut-com-veh-model/${selectedTypeId}/${brandId}`,
          {
            // headers: { Authorization: `Bearer ${token}` }, // Removed token
          }
        );
        return response.data.data;
      }

      // Handle other subcategories
      let endpoint;
      const validSubcategories = ["11", "93", "12", "94", "13", "14", "15", "19", "21", "22", "23"];
      if (!validSubcategories.includes(subcategoryIdString)) {
        return []; // Return empty array if the subcategory ID is invalid
      }

      switch (subcategoryIdString) {
        case "11":
          endpoint = "ad-car-brand-models";
          break;
        case "93":
          endpoint = "ad-car-brand-models";
          break;
        case "12":
          endpoint = "ad-motorcycle-bike-model";
          break;
        case "94":
          endpoint = "ad-motorcycle-bike-model";
          break;
        case "13":
          endpoint = "ad-moto-bull-modes";
          break;
        case "14":
          endpoint = "ad-motorcycle-scooter-mode";
          break;
        case "15":
          endpoint = "ad-motorcycle-scooter-model";
          break;
        case "19":
          endpoint = "ad-com-veh-and-aut-aut-model";
          break;
        case "21":
          endpoint = "ad-mobile-brand-models";
          break;
        case "22":
          endpoint = "ad-mobi-mobi-bran-models";
          break;
        case "23":
          endpoint = "ad-mobi-came-brans";
          break;
        default:
          endpoint = "ad-car-brand-models"; // Default case
      }

      let url;
      if (subcategoryIdString === "13") {
        url = `${BASE_URL}/api/${endpoint}`;
      } else {
        // For other subcategories, we'll fetch all models if no brand is selected
        url = brandId
          ? `${BASE_URL}/api/${endpoint}/${brandId}`
          : `${BASE_URL}/api/${endpoint}`;
      }

      const response = await axios.get(url, {
        // headers: { Authorization: `Bearer ${token}` }, // Removed token
      });
      return response.data.data;
    },
    {
      enabled: isOpen && Boolean(subcategoryId) && 
        // Only require both selectedTypeId and brandId for subcategory 18
        (subcategoryId !== "18" || (Boolean(selectedTypeId) && Boolean(brandId))),
    }
  );
};