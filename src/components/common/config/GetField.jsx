import React from 'react';
import { vehicleData } from '../../../Data/VehicleData';

const textFields = ['title', 'description'];
const numberFields = ['salary'];

const generateFloorOptions = (max) =>
  Array.from({ length: max }, (_, i) => ({ id: (i + 1).toString(), name: (i + 1).toString() }))
    .concat([{ id: `${max}+`, name: `${max}+` }]);

const specialFields = {
  type: { type: 'select', label: "Type" },
  brand: { type: 'select', label: "Brand" },
  model: { type: 'select', label: "Model" },
  variant: { type: 'select', label: "Variant" },
  listedBy: { type: 'select', label: "Listed By", options: [{ id: "owner", name: "Owner" }, { id: "builder", name: "Builder" }, { id: "dealer", name: "Dealer" }, { id: "broker", name: "Broker" }] },
  totalFloors: { type: 'select', label: "Total Floors", options: generateFloorOptions(20) },
  floorNo: { type: 'select', label: "Floor Number", options: generateFloorOptions(20) },
  facing: { type: 'select', label: "Facing", options: [{ id: "east", name: "East" }, { id: "north", name: "North" }, { id: "south", name: "South" }, { id: "west", name: "West" }, { id: "north-east", name: "North-East" }, { id: "north-west", name: "North-West" }, { id: "south-east", name: "South-East" }, { id: "south-west", name: "South-West" }] },
  typeOfAccomodation: { type: 'select', label: "Type of Accommodation", options: [{ id: "any", name: "Any" }, { id: "family", name: "Family Only" }, { id: "bachelors", name: "Bachelors Only" }, { id: "ladies", name: "Ladies Only" }] },
  totalLandArea: { type: 'number', label: "Total Land Area (in cents)", rules: { required: "Total Land Area is required", min: { value: 1, message: "Land area must be at least 1 cent" }, max: { value: 10000, message: "Land area cannot exceed 10000 cents" } } },
  superBuiltupArea: { type: 'number', label: "Super Built Up Area", rules: { required: "Super Built Up Area is required", min: { value: 50, message: "Area must be at least 50 sq ft" }, max: { value: 10000, message: "Area cannot exceed 10000 sq ft" } } },
  carpetArea: { type: 'number', label: "Carpet Area", rules: { required: "Carpet Area is required", min: { value: 50, message: "Area must be at least 50 sq ft" }, max: { value: 10000, message: "Area cannot exceed 10000 sq ft" } } },
  price: { type: 'number', label: "Price", rules: { required: "Price is required", min: { value: 50000, message: "Price must be at least ₹50,000" }, max: { value: 1000000000, message: "Price cannot exceed ₹100 Crore" } } },
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

export const getFieldConfig = (fieldName, districts, towns, brands, models, variants, types) => {
  const commonRules = { required: `${fieldName} is required` };
  const numberRules = { ...commonRules, min: { value: 0, message: `${fieldName} must be positive` } };

  if (textFields.includes(fieldName)) return { type: 'text', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: commonRules };
  if (numberFields.includes(fieldName)) return { type: 'number', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: numberRules };

  if (fieldName in specialFields) {
    const field = specialFields[fieldName];
    if (['brand', 'model', 'variant', 'type'].includes(fieldName)) {
      return { ...field, options: { brand: brands, model: models, variant: variants, type: types }[fieldName] || [], rules: commonRules };
    }
    return { ...field, rules: field.rules || (field.type === 'number' ? numberRules : commonRules) };
  }

  return fieldName === 'locationDistrict' ? { type: 'select', label: "District", options: districts || [], rules: commonRules }
    : fieldName === 'locationTown' ? { type: 'select', label: "Town", options: towns || [], rules: commonRules }
    : fieldName === 'adShowroom' ? null
    : null;
};

export default getFieldConfig;