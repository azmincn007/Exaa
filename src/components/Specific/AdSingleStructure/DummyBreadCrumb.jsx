import React from 'react';

const Breadcrumb = ({ locationDistrict, locationTown, adCategory, adSubCategory, title }) => {
    console.log(title);
    
  const items = [
    { label: 'Home', isLink: true },
    { label: adCategory, isLink: false },
    { label: adSubCategory, isLink: false },
    { label: `${adSubCategory} in ${locationDistrict}`, isLink: false },
    { label: `${adSubCategory} in ${locationTown}`, isLink: false },
    { label: title, isLink: false }
  ];

  return (
    <nav aria-label="breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center list-none p-0 m-0">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="text-gray-400 mx-1">{'>'}</li>
            )}
            <li className={index === 0 ? 'text-blue-600' : 'text-gray-500'}>
              {item.isLink ? (
                <span 
                  onClick={() => window.location.href = '/'} 
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {item.label}
                </span>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;