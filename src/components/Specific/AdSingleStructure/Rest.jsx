import React from 'react';

const Rest = ({ adData }) => {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to safely render values
    const safeRender = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'string' || typeof value === 'number') return value;
        if (typeof value === 'object') {
            if (value.name) return value.name;
            if (value.id) return value.id;
            return JSON.stringify(value);
        }
        return String(value);
    };
    
    // Create a key-value pair data structure for specific fields
    const keyValuePairs = [
        { label: 'Category', value: adData?.adCategory?.name },
        { label: 'Sub Category', value: adData?.adSubCategory?.name },
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
        { label: 'Location', value: adData?.locationDistrict?.name || adData?.locationTown?.name || 'Location not available' },
        { label: 'Posting Date', value: adData?.createdAt ? formatDate(adData.createdAt) : undefined },
    ];
   
    return (
        <div className="col-span-12 md:col-span-8 bg-white rounded-lg p-4 font-Inter">
            <div>
                <div className='font-semibold text-base md:text-2xl'>{safeRender(adData?.title)}</div>
                {(adData?.variant || adData?.type) && (
                    <div className='text-gray-500 text-xs md:text-base'>
                        {safeRender(adData?.variant || adData?.type)}
                    </div>
                )}
                <div className='font-semibold my-2 text-base md:text-xl'>
                    {adData?.price ? (
                        `₹ ${new Intl.NumberFormat('en-IN').format(adData.price)}`
                    ) : adData?.monthlyRent ? (
                        `₹ ${new Intl.NumberFormat('en-IN').format(adData.monthlyRent)} /mon`
                    ) : adData?.salary ? (
                        `₹ ${new Intl.NumberFormat('en-IN').format(adData.salary)} /mon`
                    ) : 'Price not available'}
                </div>
            </div>
            <div className="grid grid-cols-12 gap-x-2 gap-y-2 mt-8">
                {keyValuePairs.map(({ label, value }) => (
                    value !== undefined && value !== null ? (
                        <React.Fragment key={label}>
                            <div className="col-span-6 sm:col-span-3 flex justify-start">
                                <span className="text-[12px] text-exagrey md:text-[14px] font-semibold">{label}:</span>
                            </div>
                            <div className="col-span-6 sm:col-span-3 flex justify-start">
                                <span className="text-[12px] md:text-[14px] break-words">{safeRender(value)}</span>
                            </div>
                        </React.Fragment>
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default Rest;