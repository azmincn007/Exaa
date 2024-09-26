import React from 'react';

const FieldConfig = ({ districts, towns }) => {
  const getFieldConfig = (fieldName) => {
    const commonRules = { required: `${fieldName} is required` };
    const numberRules = { ...commonRules, min: { value: 0, message: `${fieldName} must be positive` } };
    
    const textFields = ['title', 'description', 'brand', 'model', 'variant', 'transmission', 'listedBy', 'facing', 'qualification'];
    const numberFields = ['price', 'year', 'bedrooms', 'bathrooms', 'maintenance', 'length', 'breadth', 'experience', 'salary'];
    
    if (textFields.includes(fieldName)) {
      return { type: 'text', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: commonRules };
    }
    
    if (numberFields.includes(fieldName)) {
      return { type: 'number', label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), rules: numberRules };
    }
    
    const fieldConfigs = {
      plotArea: { type: 'number', label: "Plot Area", rules: numberRules },
      carpetArea: { type: 'number', label: "Carpet Area", rules: numberRules },
      projectName: { type: 'text', label: "Project Name", rules: commonRules },
      rtoCode: { type: 'text', label: "RTO Code", rules: commonRules },
      typeOfAccomodation: { type: 'text', label: "Type of Accommodation", rules: commonRules },
      totalFloors: { type: 'number', label: "Total Floors", rules: numberRules },
      carParking: { type: 'number', label: "Car Parking", rules: numberRules },
      floorNo: { type: 'number', label: "Floor No.", rules: numberRules },
      kmDriven: { type: 'number', label: "KM Driven", rules: numberRules },
      noOfOwners: { type: 'number', label: "Number of Owners", rules: numberRules },
      totalLandArea: { type: 'number', label: "Total Land Area", rules: numberRules },
      engineCC: { type: 'number', label: "Engine CC", rules: numberRules },
      motorPower: { type: 'number', label: "Motor Power", rules: numberRules },
      buyYear: { type: 'number', label: "Buy Year", rules: numberRules },
      monthlyRent: { type: 'number', label: "Monthly Rent", rules: numberRules },
      superBuiltupArea: { type: 'number', label: "Super Built Up Area", rules: numberRules },
      securityAmount: { type: 'number', label: "Security Amount", rules: numberRules },
      isActiveAd: { type: 'checkbox', label: "Is Active Ad", rules: {} },
      isShowroomAd: { type: 'checkbox', label: "Is Showroom Ad", rules: {} },
      furnishing: { type: 'select', label: "Furnishing", options: ["Furnished", "Semi-Furnished", "Unfurnished"], rules: commonRules },
      constructionStatus: { type: 'select', label: "Construction Status", options: ["Under Construction", "Ready to Move"], rules: commonRules },
      salaryPeriod: { type: 'select', label: "Salary Period", options: ["Monthly", "Annual"], rules: commonRules },
      fuel: { type: 'radio', label: "Fuel", options: ["Petrol", "Diesel"], rules: commonRules },
      locationDistrict: { type: 'select', label: "District", options: districts || [], rules: commonRules },
      locationTown: { type: 'select', label: "Town", options: towns || [], rules: commonRules },
      adShowroom: null
    };

    return fieldConfigs[fieldName] || null;
  };

  return { getFieldConfig };
};

export default FieldConfig;