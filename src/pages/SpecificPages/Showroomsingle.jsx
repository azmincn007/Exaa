import React, { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Showroomsingleimg from "../../assets/showroomsingle.png";
import { Select, Button } from "@chakra-ui/react";
import { VscSettings } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import CardShowroom from "../../components/common/Cards/CardShowroom";
import { BASE_URL } from "../../config/config";
import { DistrictContext, TownContext } from "../../App";
import ShowroomDetails from "../../components/Specific/showroom/ShowroomDetails";
import { useAuth } from "../../Hooks/AuthContext";
import ShowroomSingleSkeleton from "../../components/Skelton/Showroomskelton";

function Showroomsingle() {
  const { id } = useParams();
  const [sortOrder, setSortOrder] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [dateSort, setDateSort] = useState(false);
  const [visibleCards, setVisibleCards] = useState(6);
  const [selectedTown] = useContext(TownContext);
  const [selectedDistrict] = useContext(DistrictContext);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
const { isLoggedIn, isInitialized } = useAuth();

// 3. The useEffect hook that handles the navigation
useEffect(() => {
  if (isInitialized && !isLoggedIn) {
    navigate("/");
  }
}, [isInitialized, isLoggedIn, navigate]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is typically 768px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const fetchShowroomData = async () => {
    const token = localStorage.getItem('UserToken');
    const response = await axios.get(`${BASE_URL}/api/ad-showrooms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  };

  const fetchOtherShowroomAds = async () => {
    const token = localStorage.getItem('UserToken');
    const response = await axios.get(`${BASE_URL}/api/find-other-showroom-ads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        adSubCategoryId: showroomData?.adSubCategory?.id,
        locationTownId: selectedTown === "all" ? '"all"' : String(selectedTown),
        locationDistrictId: selectedDistrict === "all" ? '"all"' : String(selectedDistrict),
        sort:''
      }
    });
    return response.data.data;
  };

  const { data: showroomData, isLoading: isLoadingShowroom, error: showroomError } = useQuery(
    ['showroom', id],
    fetchShowroomData,
    {
      onError: (error) => {
        console.error("Error fetching showroom data:", error);
      }
    }
  );

  const { data: otherAds, isLoading: isLoadingOtherAds, error: otherAdsError } = useQuery(
    ['otherShowroomAds', id, showroomData?.adSubCategory?.id],
    fetchOtherShowroomAds,
    {
      enabled: !!showroomData?.adSubCategory?.id,
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

    if (budgetFilter === "highToLow") {
      filteredAds.sort((a, b) => b.price - a.price);
    } else if (budgetFilter === "lowToHigh") {
      filteredAds.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "aToZ") {
      filteredAds.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "zToA") {
      filteredAds.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (dateSort) {
      filteredAds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filteredAds;
  }, [otherAds, sortOrder, budgetFilter, dateSort]);

  const loadMore = () => {
    setVisibleCards(prevVisibleCards => prevVisibleCards + 6);
  };

  if (isLoadingShowroom || isLoadingOtherAds) {
    return <ShowroomSingleSkeleton />;
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
      <ShowroomDetails
        imageUrl={imageUrl}
        name={showroomData?.name}
        category={showroomData?.adCategory?.name}
        showroomCategory={showroomData?.adShowroomCategory?.name}
        userRating={showroomData.userRating}
        showroomId={showroomData.id}
      />
      <div className="py-2">
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
        
        {isMobile ? (
          <div className="mt-4">
             <Swiper
      spaceBetween={16}
      slidesPerView={1.6}
      centeredSlides={false}
      pagination={{ clickable: true }}
      className="mySwiper"
      breakpoints={{
        0: {
          slidesPerView: 1.2, // 1.2 slides per view for devices below 400px
        },
        400: {
          slidesPerView: 1.6, // Default for devices 400px and above
        },
      }}
    >
      {sortedAndFilteredAds.slice(0, visibleCards).map((ad) => (
        <SwiperSlide key={ad.id}>
          <CardShowroom ad={ad} />
        </SwiperSlide>
      ))}
    </Swiper>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {sortedAndFilteredAds.slice(0, visibleCards).map((ad) => (
              <CardShowroom key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        {visibleCards < sortedAndFilteredAds.length && (
          <div className="flex justify-end mt-4">
            <Button
              onClick={loadMore}
              className="bg-[#0071BC] text-white px-4 flex gap-4 font-Inter font-400 rounded-lg"
              size="sm"
            >
              <span className="text-12">See all</span> <FaChevronRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Showroomsingle;
