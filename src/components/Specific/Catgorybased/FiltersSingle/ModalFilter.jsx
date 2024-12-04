import React, { useState, useEffect } from "react";
import { Checkbox, VStack, Text, Heading } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../../../config/config";

const ModelFilter = ({ filterValues, handleFilterChange, getUserToken, selectedBrands, subCategoryId }) => {
  const [models, setModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState(filterValues.model || []);
console.log(selectedBrands);

console.log(subCategoryId);

  useEffect(() => {
    const fetchModels = async () => {
      if (selectedBrands.length === 0) {
        setModels([]);
        return;
      }

      let endpoint;
      switch (subCategoryId) {
        case 11:
          endpoint = "ad-car-brands-models";
          break;
        case 12:
          endpoint = "ad-motorcycle-bike-brands-models";
          break;
        case 14:
          endpoint = "ad-motorcycle-scooter-brands-models";
          break;
        case 15:
          endpoint = "ad-motorcycle-scooter-brands-models";
          break;
   
        case 21:
          endpoint = "ad-mobile-brands-models";
          break;
        case 22:
          endpoint = "ad-mobile-brands-models";
          break;

        default:
          endpoint = "ad-mobile-brands-models";
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/${endpoint}`, {
          params: { brandsArray: JSON.stringify(selectedBrands) },
        });

        if (response.data && Array.isArray(response.data.data)) {
          const formattedModels = response.data.data.map((model) => ({
            id: model.id,
            name: model.name,
          }));
          setModels(formattedModels);
        } else {
          console.error("Unexpected response format:", response.data);
          setModels([]);
        }
      } catch (error) {
        console.error(`Error fetching models for ${endpoint}:`, error);
        setModels([]);
      }
    };

    fetchModels();
  }, [selectedBrands, getUserToken, subCategoryId]);

  const handleModelChange = (modelId) => {
    const updatedSelection = selectedModels.includes(modelId) ? selectedModels.filter((id) => id !== modelId) : [...selectedModels, modelId];

    setSelectedModels(updatedSelection);
    handleFilterChange("model", updatedSelection);
  };



  return (
    <VStack  align="start" spacing={4}>
      <Text className="font-semibold" size="sm">Select Models</Text>
      <div className="max-h-[200px] overflow-scroll flex flex-col w-full gap-2">
      {models.map((model) => (
        <Checkbox  key={model.id} isChecked={selectedModels.includes(model.id)} onChange={() => handleModelChange(model.id)}>
          {model.name}
        </Checkbox>
      ))}
      </div>
    </VStack>
  );
};

export default ModelFilter;
