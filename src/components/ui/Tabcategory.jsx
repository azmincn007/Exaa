import React from 'react';
import { Tab, TabList, Tabs, Skeleton } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../config/config';

const fetchCategories = async () => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/ad-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

function Tabcategory() {
  const { data, isLoading, isError, error } = useQuery('categories', fetchCategories);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Limit the data to a maximum of 8 categories
  const limitedData = data ? data.slice(0, 8) : [];

  return (
    <div className="">
      <Tabs variant="unstyled">
        <TabList className='flex flex-wrap' borderBottom="none">
          {isLoading ? (
            // Skeleton loading state
            Array(8).fill(0).map((_, index) => (
              <Tab key={index} className="min-w-fit" _focus={{ boxShadow: 'none' }}>
                <Skeleton height="20px" width="80px" />
              </Tab>
            ))
          ) : (
            // Actual data
            limitedData.map((category) => (
              <Tab 
                key={category.id} 
                className="min-w-fit"
                _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}
                _focus={{ boxShadow: 'none' }}
              >
                {category.name}
              </Tab>
            ))
          )}
        </TabList>
      </Tabs>
    </div>
  );
}

export default Tabcategory;