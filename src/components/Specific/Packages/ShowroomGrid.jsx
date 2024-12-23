import React from "react";
import axios from "axios";
import { useQuery } from 'react-query';
import { BASE_URL } from "../../../config/config";
import BoostGridBox from "./BoostGridBox";
import ShowroomGridBox from "./ShowroomGridBox";



// Fetch Boost Packages
const fetchShowroomPackages = async () => {
  const response = await axios.get(`${BASE_URL}/api/ad-show-subs-packs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
    },
  });
  console.log(response.data.data);
  return response.data.data;
};


const ShowroomGrid = ({id}) => {
  // Fetch boost tags

  // Fetch boost packages
  const { data: packagesData, isLoading: isPackagesLoading, isError: isPackagesError } = useQuery("showroomPackages", fetchShowroomPackages);






  return (
    <div>
     
      <ShowroomGridBox ShowroomPackages={packagesData} id={id} />
      
    </div>
  );
};

export default ShowroomGrid;
