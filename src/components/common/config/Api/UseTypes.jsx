import { useQuery } from 'react-query';
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useTypes = (isOpen, getUserToken, subcategoryId) => {
  return useQuery(
    ["types", subcategoryId],
    async () => {
      const subcategoryIdString = String(subcategoryId);

      // Check for valid subcategory IDs
      const validSubcategories = ["1", "2", "3", "4", "5", "8", "18"];
      if (!validSubcategories.includes(subcategoryIdString)) {
        return []; // Return empty array if the subcategory ID is invalid
      }

      let endpoint;
      if (subcategoryIdString === "1") {
        endpoint = "ad-p-f-s-h-a-v-ts";
      } else if (subcategoryIdString === "2") {
        endpoint = "ad-p-f-s-f-a-a-ts";
      }
      else if (subcategoryIdString === "3") {
        endpoint = "ad-p-f-r-h-a-a-f-ts";
      }
      else if (subcategoryIdString === "4") {
        endpoint = "ad-p-f-r-h-a-a-f-ts";
      }
      else if (subcategoryIdString === "5") {
        endpoint = "ad-p-f-r-h-a-a-f-ts";
      }
      else if (subcategoryIdString === "8") {
        endpoint = "ad-p-p-g-a-g-h-ts";
      }
      else if (subcategoryIdString === "18") {
        endpoint = "ad-c-v-a-a-c-v-ts";
      }
     else {
        throw new Error("Invalid subcategory ID for types");
      }

      const response = await axios.get(`${BASE_URL}/api/${endpoint}`);

      return response.data.data;
    },
    {
        enabled: isOpen && Boolean(subcategoryId), 
    }
  );
};