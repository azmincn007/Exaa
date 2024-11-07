import React from "react";
import axios from "axios";
import { useQuery } from 'react-query';
import { BASE_URL } from "../../../config/config";
import PackageGrid from "./PackagesadsBoxes";
import BoostGridBox from "./BoostGridBox";

// Fetch Boost Tags
const fetchBoostTags = async () => {
  const response = await axios.get(`${BASE_URL}/api/ad-boost-tags`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });
  return response.data.data;
};

// Fetch Boost Packages
const fetchBoostPackages = async () => {
  const response = await axios.get(`${BASE_URL}/api/ad-boost-packages`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });
  return response.data.data;
};

const categoryColors = {
  Featured: "text-green-500",
  Verified: "text-blue-500",
  "Verified Seller": "text-blue-900",
  Premium: "text-red-600",
  "New Arrival": "text-orange-500",
  "Best seller": "text-red-500",
  "Hot Deal": "text-red-600",
  "Clearance Sale": "text-teal-500",
  Trending: "text-blue-600",
  popular: "text-pink-500",
  "Best Buy": "text-indigo-500",
  "Urgent Sale": "text-purple-500",
};

const Boostgrid = ({id}) => {
  // Fetch boost tags
  const { data: tagsData, isLoading: isTagsLoading, isError: isTagsError } = useQuery("boostTags", fetchBoostTags);

  // Fetch boost packages
  const { data: packagesData, isLoading: isPackagesLoading, isError: isPackagesError } = useQuery("boostPackages", fetchBoostPackages);

  if (isTagsLoading || isPackagesLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isTagsError || isPackagesError) {
    return <div>Error loading data</div>;
  }

  const displayTags = tagsData || [];

  return (
    <div>
      {/* Boost Tags Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Boost every 7 days</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {displayTags.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <svg
                className={`w-5 h-5 mr-2 ${categoryColors[item.name] || 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className={categoryColors[item.name] || 'text-gray-500'}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Boost Packages Section */}
      <div className="p-4 mt-6 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Available Boost Packages</h2>
        <BoostGridBox boostTags={packagesData} id={id} /> {/* Pass fromBoost as true */}
      </div>
    </div>
  );
};

export default Boostgrid;
