import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Showroomsingleimg from "../../assets/showroomsingle.png";
import { Select, Button } from "@chakra-ui/react";
import { VscSettings } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import CardShowroom from "../../components/common/Cards/CardShowroom";
import { BASE_URL } from "../../config/config";

const fetchShowroomData = async (id) => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/ad-showrooms/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data.data);
  
  return response.data.data;
};

const fetchOtherShowroomAds = async (adShowroomId) => {
  const token = localStorage.getItem('UserToken');
  const response = await axios.get(`${BASE_URL}/api/find-other-showroom-ads/${adShowroomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data.data);
  
  return response.data.data;
};

function Showroomsingle() {
  const { id } = useParams();
  const [sortOrder, setSortOrder] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [dateSort, setDateSort] = useState(false);
  const [visibleCards, setVisibleCards] = useState(6);

  const { data: showroomData, isLoading: isLoadingShowroom, error: showroomError } = useQuery(
    ['showroom', id],
    () => fetchShowroomData(id),
    {
      onSuccess: (data) => {
        // You can add any additional logic here if needed
      },
      onError: (error) => {
        console.error("Error fetching showroom data:", error);
      }
    }
  );

  const { data: otherAds, isLoading: isLoadingOtherAds, error: otherAdsError } = useQuery(
    ['otherShowroomAds', id],
    () => fetchOtherShowroomAds(id),
    {
      onSuccess: (data) => {
        // You can add any additional logic here if needed
      },
      onError: (error) => {
        console.error("Error fetching other showroom ads:", error);
      }
    }
  );

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setBudgetFilter(event.target.value);
  };

  const handleDateSort = () => {
    setDateSort(!dateSort);
  };

  const sortedAndFilteredAds = useMemo(() => {
    if (!otherAds) return [];
    
    let filteredAds = [...otherAds];

    // Apply budget filter
    if (budgetFilter === "highToLow") {
      filteredAds.sort((a, b) => b.price - a.price);
    } else if (budgetFilter === "lowToHigh") {
      filteredAds.sort((a, b) => a.price - b.price);
    }

    // Apply title sort
    if (sortOrder === "aToZ") {
      filteredAds.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "zToA") {
      filteredAds.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Apply date sort if active
    if (dateSort) {
      filteredAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filteredAds;
  }, [otherAds, sortOrder, budgetFilter, dateSort]);

  const loadMore = () => {
    setVisibleCards(prevVisibleCards => prevVisibleCards + 6);
  };

  if (isLoadingShowroom || isLoadingOtherAds) {
    return <div>Loading...</div>;
  }

  if (showroomError || otherAdsError) {
    return <div>Error: {showroomError?.message || otherAdsError?.message}</div>;
  }

  const imageUrl = showroomData?.images && showroomData.images.length > 0
    ? `${BASE_URL}${showroomData.images[0].url}`
    : Showroomsingleimg;

  return (
    <div className="w-[80%] mx-auto font-Inter">
      <h1 className="py-2 font-semibold flex justify-center">Showroom</h1>
      <div className="w-full overflow-hidden font-sans bg-blue-600 rounded-xl ">
        <div className="h-[500px] overflow-hidden ">
          <img 
            src={imageUrl} 
            alt="Showroom image" 
            className="w-full h-full object-cover p-2 rounded-xl" 
          />
        </div>
        <div className="text-white p-4 flex justify-center flex-col items-center">
          <h1 className="text-2xl font-bold m-0">{showroomData?.name || 'Name not available'}</h1>
          <p className="text-sm mt-1 mb-0">Category: {showroomData?.adCategory?.name || 'Category not available'}</p>
          <p className="text-sm mt-1 mb-0">Showroom Category: {showroomData?.adShowroomCategory?.name || 'Category not available'}</p>
        </div>
      </div>
      <div className="py-2 ">
        <h1 className="font-semibold py-2">All Ads</h1>
        <div className="bg-[#0071BC1A] flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-24 py-2">
              <Select 
                placeholder="Sort by" 
                className="border-2 border-black text-black rounded-full" 
                size="sm"
                onChange={handleSortChange}
                value={sortOrder}
              >
                <option value="aToZ">A to Z</option>
                <option value="zToA">Z to A</option>
              </Select>
            </div>
            <div className="w-24 py-2">
              <Select 
                placeholder="Budget" 
                className="border-2 border-black text-black rounded-full" 
                size="sm"
                onChange={handleBudgetChange}
                value={budgetFilter}
              >
                <option value="highToLow">High to Low</option>
                <option value="lowToHigh">Low to High</option>
              </Select>
            </div>
            <div>
              <VscSettings className="h-10 w-10"/> 
            </div>
          </div>
          <div>
            <button
              onClick={handleDateSort}
              className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                dateSort ? 'bg-blue-500 text-white' : 'bg-transparent text-black'
              }`}
            >
              <MdDateRange className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {sortedAndFilteredAds.slice(0, visibleCards).map((ad) => (
            <CardShowroom
              key={ad.id}
              imageUrl={`${BASE_URL}${ad.images.url}`}
              status={ad.status}
              title={ad.title}
              price={ad.price}
              views={ad.views}
              likes={ad.likes}
              adCategory={ad.adCategory?.id}
              id={ad.id}
              location={ad.locationTown.name}
              postedDate={new Date(ad.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            />
          ))}
        </div>
        {visibleCards < sortedAndFilteredAds.length && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={loadMore}
              className='bg-[#0071BC] text-white px-4 flex gap-4 font-Inter font-400 rounded-lg'
              size="sm"
            >
              <span className='text-12'>See all</span> <FaChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Showroomsingle;