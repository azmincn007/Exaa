import { useQuery } from "react-query";
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useBrands = (isOpen, getUserToken, subcategoryId) => {

  return useQuery(
    ["brands", subcategoryId], // Include subcategoryId in the query key to refetch on change
    async () => {
      const token = getUserToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Determine the subcategory based on subcategoryId
      let subcategory;
      if (subcategoryIdString === "11") {
        subcategory = "ad-car-brands";
      } else if (subcategoryIdString === "12") {
        subcategory = "ad-moto-bike-brans";
      } else if (subcategoryIdString === "13") {
        subcategory = "ad-moto-bull-modes";
      } else if (subcategoryIdString === "14") {
        subcategory = "ad-moto-scoo-brans";
      } else if (subcategoryIdString === "15") {
        subcategory = "ad-moto-scoo-brans";
      } else if (subcategoryIdString === "19") {
        subcategory = "ad-c-v-a-a-a-bs";
      } else if (subcategoryIdString === "21") {
        subcategory = "ad-mobi-mobi-brans";
      } else if (subcategoryIdString === "22") {
        subcategory = "ad-mobi-mobi-brans";
      } else if (subcategoryIdString === "23") {
        subcategory = "ad-mobi-came-brans";
      } else {
        throw new Error("Invalid subcategory ID");
      }

      const response = await axios.get(`${BASE_URL}/api/${subcategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.data;
    },
    {
      enabled: isOpen && Boolean(subcategoryId), // Ensure query runs only when isOpen and subcategoryId are valid
    }
  );
};