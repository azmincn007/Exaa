import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
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
  Premium: "text-red-500",
  "New Arrival": "text-orange-500",
  "Best Seller": "text-red-600",
  "Hot Deal": "text-red-500",
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

  const filteredTagsData = tagsData.filter((item) => Object.keys(categoryColors).includes(item.name));

  return (
    <div>
      {/* Boost Tags Section */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Boost every 7 days</h2>
        <div className="grid grid-cols-1 gap-2">
          {filteredTagsData.map((item, index) => (
            <div key={index} className="flex items-center">
              <svg
                className={`w-5 h-5 mr-2 ${categoryColors[item.name]}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className={categoryColors[item.name]}>{item.name}</span>
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
