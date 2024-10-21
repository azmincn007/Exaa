import { useQuery } from "react-query";
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

export const useModels = (isOpen, getUserToken, brandId, subcategoryId) => {
  return useQuery(
    ["models", brandId, subcategoryId],
    async () => {
      const token = getUserToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Ensure subcategoryId is a string
      const subcategoryIdString = String(subcategoryId);

      // Determine the endpoint based on subcategoryId
      let endpoint;
      switch (subcategoryIdString) {
        case "11":
          endpoint = "ad-car-brand-models";
          break;
        case "12":
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    {
      enabled: isOpen && !!subcategoryId,
      // Remove the brandId dependency from the enabled condition
    }
  );
};