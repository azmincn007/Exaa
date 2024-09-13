import React from 'react';


const Rest = ({ adData }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
    
      // Create a key-value pair data structure for specific fields
      const keyValuePairs = [
       
        { label: 'Brand', value: adData?.brand },
        { label: 'Model', value: adData?.model },
        { label: 'Variant', value: adData?.variant },
        { label: 'Year', value: adData?.year },
        { label: 'Fuel', value: adData?.fuel },
        { label: 'Transmission', value: adData?.transmission },
        { label: 'KM Driven', value: adData?.kmDriven },
        { label: 'Number of Owners', value: adData?.noOfOwners },
        { label: 'RTO Code', value: adData?.rtoCode },
        { label: 'Price', value: adData?.price ? `₹ ${new Intl.NumberFormat('en-IN').format(adData.price)}` : undefined },
        { label: 'Type', value: adData?.type },
        { label: 'Bedrooms', value: adData?.bedrooms },
        { label: 'Bathrooms', value: adData?.bathrooms },
        { label: 'Furnishing', value: adData?.furnishing },
        { label: 'Listed By', value: adData?.listedBy },
        { label: 'Type of Accommodation', value: adData?.typeOfAccomodation },
        { label: 'Total Floors', value: adData?.totalFloors },
        { label: 'Floor No', value: adData?.floorNo },
        { label: 'Car Parking', value: adData?.carParking },
        { label: 'Facing', value: adData?.facing },
        { label: 'Super Builtup Area', value: adData?.superBuiltupArea ? `${adData.superBuiltupArea} sq ft` : undefined },
        { label: 'Carpet Area', value: adData?.carpetArea ? `${adData.carpetArea} sq ft` : undefined },
        { label: 'Maintenance', value: adData?.maintenance ? `₹ ${new Intl.NumberFormat('en-IN').format(adData.maintenance)}` : undefined },
        { label: 'Project Name', value: adData?.projectName },
        { label: 'Security Amount', value: adData?.securityAmount ? `₹ ${new Intl.NumberFormat('en-IN').format(adData.securityAmount)}` : undefined },
        { label: 'Plot Area', value: adData?.plotArea },
        { label: 'Length', value: adData?.length },
        { label: 'Breadth', value: adData?.breadth },
        { label: 'Construction Status', value: adData?.constructionStatus },
        { label: 'Total Land Area', value: adData?.totalLandArea },
        { label: 'Engine CC', value: adData?.engineCC },
        { label: 'Motor Power', value: adData?.motorPower },
        { label: 'Buy Year', value: adData?.buyYear },
        { label: 'Salary Period', value: adData?.salaryPeriod },
        { label: 'Qualification', value: adData?.qualification },
        { label: 'Experience', value: adData?.experience },
        { label: 'Location', value: adData?.locationDistrict && adData?.locationTown 
          ? `${adData.locationDistrict.name}, ${adData.locationTown.name}` 
          : adData?.locationDistrict?.name || adData?.locationTown?.name || 'Location not available' 
      },

        { label: 'Posting Date', value: adData?.createdAt ? formatDate(adData.createdAt) : undefined },
    ];
    console.log(adData);
    
  return (
    <div className="col-span-12 md:col-span-8 bg-white rounded-lg p-4 font-Inter">
  <div>
    <div className='font-semibold text-base md:text-2xl'>{adData?.title}</div>
    <div className='text-gray-500 text-xs md:text-base'>{adData?.variant || adData.type}</div>
    <div className='font-semibold my-2 text-base md:text-xl'>
  {adData?.price ? (
    `₹ ${new Intl.NumberFormat('en-IN').format(adData.price)}`
  ) : adData?.monthlyRent ? (
    `₹ ${new Intl.NumberFormat('en-IN').format(adData.monthlyRent)} /mon`
  ) : adData?.salary ? (
    `₹ ${new Intl.NumberFormat('en-IN').format(adData.salary)} /mon`
  ) : null}
</div>
  </div>
  <div className="grid grid-cols-12 gap-0 mt-8">
    {keyValuePairs.map(({ label, value }) => (
      value ? (
        <React.Fragment key={label}>
          <div className="col-span-3 flex justify-start mb-2">
            <span className="text-12 text-exagrey md:text-base">{label}:</span>
          </div>
          <div className="col-span-3 flex justify-start mb-2">
            <span className="text-xs md:text-base">{value}</span>
          </div>
        </React.Fragment>
      ) : null
    ))}
  </div>
</div>

  );
};

export default Rest;