import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../../config/config';

const LocationSelects = () => {
  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingTowns, setIsLoadingTowns] = useState(false);

  // Fetch districts on component mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  // Fetch towns whenever selected district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchTowns(selectedDistrict);
    } else {
      setTowns([]);
      setSelectedTown('');
    }
  }, [selectedDistrict]);

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      const response = await fetch(`${BASE_URL}/api/location-districts`);
      const result = await response.json();
      if (result.success) {
        setDistricts(result.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchTowns = async (districtId) => {
    setIsLoadingTowns(true);
    try {
      const response = await fetch(`${BASE_URL}/api/location-find-district-towns/${districtId}`);
      const result = await response.json();
      if (result.success) {
        setTowns(result.data);
      }
    } catch (error) {
      console.error('Error fetching towns:', error);
    } finally {
      setIsLoadingTowns(false);
    }
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedTown(''); // Reset town selection when district changes
  };

  const handleTownChange = (event) => {
    setSelectedTown(event.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
          Select District
        </label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isLoadingDistricts}
        >
          <option value="">Select a district</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
        {isLoadingDistricts && <p className="text-sm text-gray-500">Loading districts...</p>}
      </div>

      <div>
        <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
          Select Town
        </label>
        <select
          id="town"
          value={selectedTown}
          onChange={handleTownChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={!selectedDistrict || isLoadingTowns}
        >
          <option value="">Select a town</option>
          {towns.map((town) => (
            <option key={town.id} value={town.id}>
              {town.name}
            </option>
          ))}
        </select>
        {isLoadingTowns && <p className="text-sm text-gray-500">Loading towns...</p>}
      </div>

      {/* For debugging - you can remove this in production */}
      <div className="text-sm text-gray-500">
        <p>Selected District ID: {selectedDistrict}</p>
        <p>Selected Town ID: {selectedTown}</p>
      </div>
    </div>
  );
};

export default LocationSelects;