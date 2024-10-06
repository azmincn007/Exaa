import { useQuery } from 'react-query';
import axios from 'axios';
import { BASE_URL } from '../../../config/config';

const fetchCategories = async (userToken) => {
  if (!userToken) throw new Error('No user token found');
  const { data } = await axios.get(`${BASE_URL}/api/ad-categories`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchSubCategories = async (userToken, categoryId) => {
  if (!userToken) throw new Error('No user token found');
  if (!categoryId) throw new Error('No category selected');
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-category-sub-categories/${categoryId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchSubCategoryDetails = async (userToken, subCategoryId) => {
  if (!userToken) throw new Error('No user token found');
  if (!subCategoryId) throw new Error('No subcategory selected');
  const { data } = await axios.get(`${BASE_URL}/api/ad-find-one-sub-category/${subCategoryId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchDistricts = async (userToken) => {
  if (!userToken) throw new Error('No user token found');
  const { data } = await axios.get(`${BASE_URL}/api/location-districts`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

const fetchTowns = async (userToken, districtId) => {
  if (!userToken) throw new Error('No user token found');
  if (!districtId) throw new Error('No district selected');
  const { data } = await axios.get(`${BASE_URL}/api/location-find-district-towns/${districtId}`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  return data.data;
};

export const useCategories = (isOpen, getUserToken) => useQuery(
  ['adCategories', getUserToken],
  () => fetchCategories(getUserToken()),
  { 
    enabled: isOpen && !!getUserToken(), 
    retry: (failureCount, error) => error.message !== 'No user token found' && failureCount < 3 
  }
);

export const useSubCategories = (isOpen, getUserToken, selectedCategoryId) => useQuery(
  ['adSubCategories', getUserToken, selectedCategoryId],
  () => fetchSubCategories(getUserToken(), selectedCategoryId),
  { 
    enabled: isOpen && !!getUserToken() && !!selectedCategoryId, 
    retry: (failureCount, error) => error.message !== 'No category selected' && failureCount < 3 
  }
);

export const useDistricts = (isOpen, getUserToken) => useQuery(
  ['districts', getUserToken],
  () => fetchDistricts(getUserToken()),
  { enabled: isOpen && !!getUserToken() }
);

export const useTowns = (isOpen, getUserToken, selectedDistrictId) => useQuery(
  ['towns', getUserToken, selectedDistrictId],
  () => fetchTowns(getUserToken(), selectedDistrictId),
  { enabled: isOpen && !!getUserToken() && !!selectedDistrictId }
);

export { fetchSubCategoryDetails };