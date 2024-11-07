import { useQuery } from 'react-query';
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useTypes = (isOpen, getUserToken, subcategoryId) => {
  return useQuery(
    ["types", subcategoryId],
    async () => {
      const token = getUserToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const subcategoryIdString = String(subcategoryId);

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

      const response = await axios.get(`${BASE_URL}/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    {
        enabled: isOpen && Boolean(subcategoryId), 
    }
  );
};