import { useQuery } from 'react-query';
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useBrands = (isOpen, getUserToken, subcategoryId, selectedTypeId) => {
  
  
  return useQuery(
    ["brands", subcategoryId, selectedTypeId], // Include selectedTypeId in query key
    async () => {
      const token = getUserToken();
     
      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Special handling for subcategoryId 18
      if (subcategoryIdString === "18") {
        if (!selectedTypeId && isOpen) {
          return []; // or handle as needed when selectedTypeId is not provided
        }
        if (selectedTypeId) {
          const response = await axios.get(
            `${BASE_URL}/api/ad-com-veh-and-aut-com-veh-brand/${selectedTypeId}`
          );
          return response.data.data;
        }
      }

      // Handle other subcategories
      let subcategory;
      const validSubcategories = ["11", "93", "12", "94", "13", "14", "15", "16", "19", "21", "22", "23"];
      if (!validSubcategories.includes(subcategoryIdString)) {
        // Return early if the subcategory ID is invalid
        return []; // or return null; depending on your needs
      }
      
      if (subcategoryIdString === "11") {
        subcategory = "ad-car-brands";
      } 
      else if (subcategoryIdString === "93") {
        subcategory = "ad-car-brands";
      } 
      else if (subcategoryIdString === "12") {
        subcategory = "ad-moto-bike-brans";
      } 
      else if (subcategoryIdString === "94") {
        subcategory = "ad-moto-bike-brans";
      } else if (subcategoryIdString === "13") {
        subcategory = "ad-moto-bull-modes";
      } else if (subcategoryIdString === "14") {
        subcategory = "ad-moto-scoo-brans";
      } else if (subcategoryIdString === "15") {
        subcategory = "ad-moto-scoo-brans";
      } else if (subcategoryIdString === "16") {
        subcategory = "ad-moto-bicy-brans";
      } else if (subcategoryIdString === "19") {
        subcategory = "ad-c-v-a-a-a-bs";
      } else if (subcategoryIdString === "21") {
        subcategory = "ad-mobi-mobi-brans";
      } else if (subcategoryIdString === "22") {
        subcategory = "ad-mobi-mobi-brans";
      } else if (subcategoryIdString === "23") {
        subcategory = "ad-mobi-came-brans";
      }

      const response = await axios.get(`${BASE_URL}/api/${subcategory}`, {
      });

      return response.data.data;
    },
    {
      enabled: isOpen && Boolean(subcategoryId) && 
        // Only require selectedTypeId for subcategory 18
        (subcategoryId !== "18" || Boolean(selectedTypeId)),
    }
  );
};