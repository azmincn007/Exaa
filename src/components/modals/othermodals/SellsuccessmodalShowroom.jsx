import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import sellvector from '../../../assets/SellVector.png';
import { BASE_URL } from '../../../config/config';
import { useNavigate } from 'react-router-dom';

// Create API instance with authorization header
const api = axios.create({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
  },
});

const SellsuccessmodalShowroom = ({ 
  adType, 
  onClose, 
  adId, 
  formData, 
  apiUrl, 
  isTagCreationPossible, 
  images 
}) => {
  console.log(formData);
  console.log(apiUrl);
  const navigate = useNavigate();
  const [showTagSelect, setShowTagSelect] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const queryClient = useQueryClient();

  // Fetch boost tags
  const { data: tags, isLoading, isError } = useQuery(
    'boostTags', 
    async () => {
      const response = await api.get(`${BASE_URL}/api/ad-boost-tags`);
      return response.data.data;
    }
  );

  // Mutation for boosting the ad
  const boostMutation = useMutation(
    async (updatedFormData) => {
      try {
        const response = await api.put(
          `${BASE_URL}/api/${apiUrl}/${adId}`, 
          updatedFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      
        return response.data;
      } catch (error) {
        console.error('Boost mutation error:', error);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        console.log('Boost mutation response:', data);
        // Modify the invalidation strategy
        
        const queriesToInvalidate = [
          
          ['userAds'],
          ['pendingAds'],
          ['expiredAds'],
          ['activeAds'],
          ['showroomAds'],
          ['showrooms'],
          [`ad-${adId}`]
        ];

        // Force a refetch when invalidating
        queriesToInvalidate.forEach(queryKey => {
          console.log(`Invalidating query: ${JSON.stringify(queryKey)}`);
          queryClient.invalidateQueries(queryKey, {
            refetchActive: true,
            refetchInactive: false
          });
        });

        // Wait for invalidation to complete
        Promise.all(
          queriesToInvalidate.map(query => 
            queryClient.refetchQueries(query, { active: true })
              .then(() => console.log(`Refetched query: ${JSON.stringify(query)}`))
          )
        ).then(() => {
          // Refetch showroomAds specifically
          queryClient.refetchQueries('showroomAds', { active: true })
            .then(() => console.log('Refetched showroomAds'));
          onClose();
        });
      },
      onError: (error) => {
        console.error('Error during boost:', error);
        // You can add error handling UI here if needed
      }
    }
  );

  const handleBoostClick = () => {
    setShowTagSelect(true);
  };

  const handleTagSubmit = () => {
    if (!selectedTag) {
      return;
    }

    // Check isTagCreationPossible here before proceeding
    if (isTagCreationPossible === false) {
      onClose(); // Close the modal first
      navigate('/packages/boost-with-tags'); // Then navigate
      return;
    }

    try {
      const updatedFormData = new FormData();

      // Handle existing form data
      if (formData && typeof formData === 'object') {
        Object.entries(formData).forEach(([key, value]) => {
          // Skip existing adBoostTag to prevent duplication
          if (key === 'adBoostTag') return;

          if (Array.isArray(value)) {
            updatedFormData.append(key, JSON.stringify(value));
          } 
          else if (value === null || value === undefined) {
            updatedFormData.append(key, '');
          }
          else if (typeof value === 'object' && !(value instanceof File)) {
            updatedFormData.append(key, JSON.stringify(value));
          }
          else {
            updatedFormData.append(key, value.toString());
          }
        });
      }

      // Add the selected boost tag
      updatedFormData.append('adBoostTag', selectedTag);

      // Handle images
      if (images && Array.isArray(images)) {
        images.forEach((image, index) => {
          if (image instanceof File) {
            updatedFormData.append('images', image);
          }
        });
      }

      // Submit the mutation
      boostMutation.mutate(updatedFormData);
    } catch (error) {
      console.error('Error preparing form data:', error);
    }
  };

  const handlePreviewClick = () => {
    // Convert adCategory string to number
    const adCategoryId = parseInt(formData.adCategory) || 0;
    
    onClose(); // Close the modal first
    navigate('/ad-preview', { 
      state: { 
        adCategoryId,
        adId
      } 
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-slate-800">Loading tags...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-red-600">Error loading tags. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 flex flex-col items-center">
          {/* Success checkmark */}
          <div className="bg-emerald-500 rounded-full p-3 mb-4">
            <Check className="w-16 h-16 text-white" />
          </div>

          {/* Header text */}
          <h2 className="text-20 font-Hahmlet font-[500] text-white mb-2">
            Congratulations
          </h2>
          <p className="text-blue-400 font-Hahmlet text-14 mb-6">
            Your Ad will go live shortly...
          </p>
          
          {/* Main content box */}
          <div className="bg-white rounded-lg p-4 w-full mb-6 font-Inter">
            {/* Free ad info */}
            <p className="text-black text-[10px] text-center mb-8">
              EXXAA allows 1 free Ad in 90 days for{' '}
              <span className="text-12 font-bold">{adType}</span>
            </p>

            {/* Icon and text */}
            <div className="flex items-center justify-center mb-2">
              <img src={sellvector} className="h-7 w-7" alt="Sell vector icon" />
            </div>
            <p className="text-black text-12 font-semibold text-center">
              Reach more buyers and sell faster
            </p>
            <p className="text-black text-[10px] text-center">
              Upgrading an Ad helps you to reach more buyers
            </p>
            
            {/* Action buttons */}
            <div className="mt-4">
              {!showTagSelect ? (
                <button
                  onClick={handleBoostClick}
                  className="bg-white text-slate-800 w-full py-2 rounded-md font-semibold mb-3 
                           hover:bg-gray-100 transition-colors border-black border-[1px] h-[40px]"
                >
                  Boost with tags
                </button>
              ) : (
                <div className="mb-3">
                  {/* Tag selection dropdown */}
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 mb-2 text-slate-700"
                  >
                    <option value="">Select a tag</option>
                    {tags?.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>

                  {/* Submit button */}
                  <button
                    onClick={handleTagSubmit}
                    disabled={boostMutation.isLoading || !selectedTag}
                    className="bg-slate-700 text-white w-full py-2 rounded-md font-semibold 
                             hover:bg-slate-600 transition-colors h-[40px] 
                             disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {boostMutation.isLoading ? 'Boosting...' : 'Submit'}
                  </button>
                </div>
              )}

              {/* Preview button */}
              <button 
                onClick={handlePreviewClick}
                className="bg-slate-700 text-white w-full py-2 rounded-md font-semibold 
                         hover:bg-slate-600 transition-colors h-[40px]"
              >
                Preview Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellsuccessmodalShowroom;