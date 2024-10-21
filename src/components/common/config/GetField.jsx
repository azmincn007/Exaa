import React from 'react';
import { vehicleData } from '../../../Data/VehicleData';

const textFields = ['title', 'description'];
const numberFields = ['salary'];

const generateFloorOptions = (max) =>
  Array.from({ length: max }, (_, i) => ({ id: (i + 1).toString(), name: (i + 1).toString() }))
    .concat([{ id: `${max}+`, name: `${max}+` }]);

const subcategoryPriceRanges = {
  1: { min: 50000, max: 1000000 },
  2: { min: 50000, max: 1000000},
  3: { min: 50000, max: 500000000000000},
  6: { min: 10000, max: 100000000},
  11: { min: 1000, max: 50000000},
  12: { min: 500, max: 3000000},
  13: { min: 500, max: 3000000},
  14: { min: 500, max: 1000000},
  15: { min: 500, max: 1000000},
  16: { min: 500, max: 1000000},
  18: { min: 1000, max: 100000000},
  19: { min: 500, max: 1000000},
  21: { min: 200, max: 500000},
  22: { min: 200, max: 500000},
  23: { min: 500, max: 1000000},

  59: { min: 50, max: 1000000},
  60: { min: 50, max: 1000000},
  61: { min: 50, max: 1000000},
  62: { min: 50, max: 1000000},
  63: { min: 50, max: 1000000}, 
  64: { min: 50, max: 1000000}, 
  65: { min: 50, max: 1000000}, 
  66: { min: 50, max: 1000000}, 
  67: { min: 50, max: 1000000}, 
  68: { min: 50, max: 1000000}, 
  69: { min: 50, max: 1000000}, 
  70: { min: 50, max: 1000000}, 

  71: { min: 30, max: 1000000}, 
  72: { min: 30, max: 1000000}, 
  73: { min: 30, max: 1000000}, 




  

  






  

};

const specialFields = {
  type: { type: 'select', label: "Type" },
  brand: { type: 'select', label: "Brand" },
  model: { type: 'select', label: "Model" },
  variant: { type: 'select', label: "Variant" },
  listedBy: { type: 'select', label: "Listed By", options: [{ id: "Owner", name: "Owner" }, { id: "Builder", name: "Builder" }, { id: "Dealer", name: "Dealer" }, { id: "Broker", name: "Broker" }] },
  totalFloors: { type: 'select', label: "Total Floors", options: generateFloorOptions(20) },
  floorNo: { type: 'select', label: "Floor Number", options: generateFloorOptions(20) },
  facing: { type: 'select', label: "Facing", options: [{ id: "East", name: "East" }, { id: "North", name: "North" }, { id: "South", name: "South" }, { id: "West", name: "West" }, { id: "North-East", name: "North-East" }, { id: "North-West", name: "North-West" }, { id: "South-East", name: "South-East" }, { id: "South-West", name: "South-West" }] },
  typeOfAccomodation: { type: 'select', label: "Type of Accommodation", options: [{ id: "any", name: "Any" }, { id: "family", name: "Family Only" }, { id: "bachelors", name: "Bachelors Only" }, { id: "ladies", name: "Ladies Only" }] },
  totalLandArea: { type: 'number', label: "Total Land Area (in cents)", rules: { required: "Total Land Area is required", min: { value: 1, message: "Land area must be at least 1 cent" }, max: { value: 10000, message: "Land area cannot exceed 10000 cents" } } },
  superBuiltupArea: { type: 'number', label: "Super Built Up Area", rules: { required: "Super Built Up Area is required", min: { value: 50, message: "Area must be at least 50 sq ft" }, max: { value: 10000, message: "Area cannot exceed 10000 sq ft" } } },
  carpetArea: { type: 'number', label: "Carpet Area", rules: { required: "Carpet Area is required", min: { value: 50, message: "Area must be at least 50 sq ft" }, max: { value: 10000, message: "Area cannot exceed 10000 sq ft" } } },
  price: { 
    type: 'number', 
    label: "Price", 
    getRules: (adSubcategoryId) => {
      const { min, max } = subcategoryPriceRanges[adSubcategoryId] || { min: 50, max: 1000000 };
      return { 
        required: "Price is required", 
        min: { value: min, message: `Price for ${name} must be at least ₹${min.toLocaleString()}` }, 
        max: { value: max, message: `Price for ${name} cannot exceed ₹${max.toLocaleString()}` } 
      };
    }
  },
  bedrooms: { type: 'select', label: "Bedrooms", options: [{ id: "1", name: "1" }, { id: "2", name: "2" }, { id: "3", name: "3" }, { id: "4", name: "4" }, { id: "4+", name: "4+" }] },
  bathrooms: { type: 'select', label: "Bathrooms", options: [{ id: "1", name: "1" }, { id: "2", name: "2" }, { id: "3", name: "3" }, { id: "4", name: "4" }, { id: "4+", name: "4+" }] },
  projectName: { type: 'text', label: "Project Name" },
  rtoCode: { type: 'select', label: "RTO Code", options: vehicleData.rtoCodes },
  carParking: { type: 'select', label: "Car Parking", options: [{ id: "1", name: "1" }, { id: "2", name: "2" }, { id: "3", name: "3" }, { id: "4", name: "4" }] },
  noOfOwners: { type: 'select', label: "Number of Owners", options: [{ id: "1", name: "1" }, { id: "2", name: "2" }, { id: "3", name: "3" }, { id: "4", name: "4" }, { id: "5+", name: "5+" }] },
  motorPower: { type: 'number', label: "Motor Power" },
  engineCC: { type: 'select', label: "Engine CC", options: vehicleData.engineCC },
  buyYear: { type: 'select', label: "Buy Year", options: vehicleData.buyYear },
  maintenance: { type: 'number', label: "Maintenance", rules: { required: "Maintenance is required", min: { value: 100, message: "Maintenance must be at least ₹100" }, max: { value: 30000, message: "Maintenance cannot exceed ₹30,000" } } },
  length: { type: 'number', label: "Length (in feet)", rules: { required: "Length is required", min: { value: 1, message: "Length must be at least 1 foot" } } },
  breadth: { type: 'number', label: "Breadth (in feet)", rules: { required: "Breadth is required", min: { value: 1, message: "Breadth must be at least 1 foot" } } },
  securityAmount: { type: 'number', label: "Security Amount", rules: { required: "Security Amount is required", min: { value: 0, message: "Security Amount must be at least ₹0" }, max: { value: 5000000, message: "Security Amount cannot exceed ₹50,00,000" } } },
  monthlyRent: { type: 'number', label: "Monthly Rent", rules: { required: "Monthly Rent is required", min: { value: 100, message: "Monthly Rent must be at least ₹100" }, max: { value: 1000000, message: "Monthly Rent cannot exceed ₹10,00,000" } } },
  isActiveAd: { type: 'checkbox', label: "Is Active Ad" },
  isShowroomAd: { type: 'checkbox', label: "Is Showroom Ad" },
  furnishing: { type: 'select', label: "Furnishing", options: ["Furnished", "Semi-Furnished", "Unfurnished"] },
  constructionStatus: { type: 'select', label: "Construction Status", options: ["New Launch", "Under Construction", "Ready to Move"] },
  salaryPeriod: { type: 'select', label: "Salary Period", options: vehicleData.salaryPeriod },
  transmission: { type: 'radio', label: "Transmission", options: ["Manual", "Automatic"] },
  year: { type: 'select', label: "Year of Manufacture", options: vehicleData.years },
  fuel: { type: 'radio', label: "Fuel", options: ["Diesel", "Petrol", "CNG & Hybrids", "LPG", "Electric"] },
  kmDriven: { type: 'select', label: "KM Driven", options: vehicleData.kmDriven },
  positionType: { type: 'select', label: "Position Type", options: vehicleData.positionTypes },
  qualification: { type: 'select', label: "Qualification", options: vehicleData.qualifications },
  experience: { type: 'select', label: "Experience Required", options: vehicleData.experienceLevels },
};

export const getFieldConfig = (fieldName, districts, towns, brands, models, variants, types, selectedSubCategoryId) => {
  
  const commonRules = { required: `${fieldName} is required` };
  const numberRules = { ...commonRules, min: { value: 0, message: `${fieldName} must be positive` } };

  if (textFields.includes(fieldName)) return { type: 'text', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: commonRules };
  if (numberFields.includes(fieldName)) return { type: 'number', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: numberRules };

  if (fieldName in specialFields) {
    const field = specialFields[fieldName];
    if (['brand', 'model', 'variant', 'type'].includes(fieldName)) {
      const options = { brand: brands, model: models, variant: variants, type: types }[fieldName] || [];
      const fieldRules = ['type', 'brand'].includes(fieldName) ? commonRules : {};
      return { ...field, options, rules: fieldRules };
    }
    if (fieldName === 'price') {
      return { ...field, rules: field.getRules(selectedSubCategoryId) };
    }
    return { ...field, rules: field.rules || (field.type === 'number' ? numberRules : commonRules) };
  }

  return fieldName === 'locationDistrict' ? { type: 'select', label: "District", options: districts || [], rules: commonRules }
    : fieldName === 'locationTown' ? { type: 'select', label: "Town", options: towns || [], rules: commonRules }
    : fieldName === 'adShowroom' ? null
    : null;
};

export default getFieldConfig;