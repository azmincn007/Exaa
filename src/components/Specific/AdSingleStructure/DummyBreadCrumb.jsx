import React from 'react';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ locationDistrict, locationTown, adCategory, adSubCategory, title }) => {
    const navigate = useNavigate();

    console.log(title);
    
  const items = [
    { label: 'Home', isLink: true },
    { label: adCategory?.name, isLink: false },
    { label: adSubCategory?.name, isLink: false },
    // { label: `${adSubCategory?.name} in ${locationDistrict}`, isLink: false },
    // { label: `${adSubCategory?.name} in ${locationTown}`, isLink: false },
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
            <li className={index === 0 ? 'text-blue-600' : 'text-gray-500 hover:underline hover:text-black cursor-pointer'}>
              {index === 0 ? (
                <span 
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {item.label}
                </span>
              ) : index === 1 ? (
                <span 
                  onClick={() =>  navigate(`/category/${adCategory?.id}/${adCategory?.name}`)}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  {item.label}
                </span>
              ) : index === 2 ? (
                <span 
                onClick={() =>  navigate(`/category/${adCategory?.id}/${adCategory?.name}`, { state: { subId: adSubCategory?.id } })}
                  className="text-gray-500 hover:underline cursor-pointer"
                >
                  {item.label}
                </span>
              ) : (
                <span className="text-gray-500 hover:underline">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;