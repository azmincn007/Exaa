import React from 'react';

const textFields = ['title','type', 'description', 'transmission', 'listedBy', 'facing', 'qualification'];
const numberFields = ['price', 'year', 'bedrooms', 'bathrooms', 'maintenance', 'length', 'breadth', 'experience', 'salary'];

const specialFields = {
  brand: { type: 'select', label: "Brand" },
  model: { type: 'select', label: "Model" },
  variant: { type: 'select', label: "Variant" },
    carpetArea: { type: 'number', label: "Carpet Area" },
  projectName: { type: 'text', label: "Project Name" },
  type: { type: 'text', label: "Type" },
  rtoCode: { type: 'text', label: "RTO Code" },
  typeOfAccomodation: { type: 'text', label: "Type of Accommodation" },
  totalFloors: { type: 'number', label: "Total Floors" },
  carParking: { type: 'number', label: "Car Parking" },
  floorNo: { type: 'number', label: "Floor No." },
  kmDriven: { type: 'number', label: "KM Driven" },
  noOfOwners: { type: 'number', label: "Number of Owners" },
  totalLandArea: { type: 'number', label: "Total Land Area" },
  engineCC: { type: 'number', label: "Engine CC" },
  motorPower: { type: 'number', label: "Motor Power" },
  buyYear: { type: 'number', label: "Buy Year" },
  monthlyRent: { type: 'number', label: "Monthly Rent" },
  superBuiltupArea: { type: 'number', label: "Super Built Up Area" },
  securityAmount: { type: 'number', label: "Security Amount" },
  isActiveAd: { type: 'checkbox', label: "Is Active Ad" },
  isShowroomAd: { type: 'checkbox', label: "Is Showroom Ad" },
  furnishing: { type: 'select', label: "Furnishing", options: ["Furnished", "Semi-Furnished", "Unfurnished"] },
  constructionStatus: { type: 'select', label: "Construction Status", options: ["Under Construction", "Ready to Move"] },
  salaryPeriod: { type: 'select', label: "Salary Period", options: ["Monthly", "Annual"] },
  fuel: { type: 'radio', label: "Fuel", options: ["Petrol", "Diesel"] },
};
export const getFieldConfig = (fieldName, districts, towns, brands, models, variants) => {
  const commonRules = { required: `${fieldName} is required` };
  const numberRules = { ...commonRules, min: { value: 0, message: `${fieldName} must be positive` } };

  if (textFields.includes(fieldName)) {
    return { type: 'text', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: commonRules };
  }

  if (numberFields.includes(fieldName)) {
    return { type: 'number', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: numberRules };
  }

  if (fieldName in specialFields) {
    if (fieldName === 'brand') {
      return { 
        ...specialFields[fieldName], 
        options: brands || [],
        rules: commonRules 
      };
    }
    if (fieldName === 'model') {
      return { 
        ...specialFields[fieldName], 
        options: models || [],
        rules: commonRules 
      };
    }
    if (fieldName === 'variant') {
      return { 
        ...specialFields[fieldName], 
        options: variants || [],
        rules: commonRules 
      };
    }
    return { ...specialFields[fieldName], rules: specialFields[fieldName].type === 'number' ? numberRules : commonRules };
  }
  if (fieldName === 'locationDistrict') {
    return { type: 'select', label: "District", options: districts || [], rules: commonRules };
  }

  if (fieldName === 'locationTown') {
    return { type: 'select', label: "Town", options: towns || [], rules: commonRules };
  }

  if (fieldName === 'adShowroom') {
    return null;
  }

  return null;
};

export default getFieldConfig;