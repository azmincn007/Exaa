import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import sellvector from '../../../assets/SellVector.png';
import { BASE_URL } from '../../../config/config';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('UserToken')}`,
    'Content-Type': 'application/json',
  },
});

const CongratulationsModal = ({ adType, onClose, adId, formData, apiUrl,isTagCreationPossible }) => {
  const navigate =useNavigate() 
  console.log(isTagCreationPossible);
  useEffect(() => {
    if (isTagCreationPossible === false) {
      navigate('/packages/post-more-ads');
    }
  }, [isTagCreationPossible, navigate]);
  const [showTagSelect, setShowTagSelect] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError } = useQuery('boostTags', async () => {
    const response = await api.get(`${BASE_URL}/api/ad-boost-tags`);
    return response.data.data;
  });

  const boostMutation = useMutation(
    (updatedData) => api.put(`${BASE_URL}/api/${apiUrl}/${adId}`, updatedData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAds');
        onClose();
      },
    }
  );

  const handleBoostClick = () => {
    setShowTagSelect(true);
  };

  const handleTagSubmit = () => {
    if (selectedTag) {
      const updatedFormData = {
        ...formData,
        adBoostTag: selectedTag
      };
      boostMutation.mutate(updatedFormData);
    }
  };

  if (isLoading) return <div>Loading tags...</div>;
  if (isError) return <div>Error loading tags</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="p-6 flex flex-col items-center">
          <div className="bg-emerald-500 rounded-full p-3 mb-4">
            <Check className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-20 font-Hahmlet font-[500] text-white mb-2">Congratulations</h2>
          <p className="text-blue-400 font-Hahmlet text-14 mb-6">Your Ad will go live shortly...</p>
          
          <div className="bg-white rounded-lg p-4 w-full mb-6 font-Inter">
            <p className="text-black text-[10px] text-center mb-8">EXXAA allows 1 free Ad in 90 days for <span className='text-12 font-bold'>{adType}</span></p>
            <div className="flex items-center justify-center mb-2">
              <img src={sellvector} className='h-7 w-7' alt="" />
            </div>
            <p className="text-black text-12 font-semibold text-center">Reach more buyers and sell faster</p>
            <p className="text-black text-[10px] text-center">Upgrading an Ad helps you to reach more buyers</p>
            
            <div className='mt-4'>
              {!showTagSelect ? (
                <button
                  onClick={handleBoostClick}
                  className="bg-white text-slate-800 w-full py-2 rounded-md font-semibold mb-3 hover:bg-gray-100 transition-colors border-black border-[1px] h-[40px]"
                >
                  Boost with tags
                </button>
              ) : (
                <div className="mb-3">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 mb-2 text-slate-700"
                  >
                    <option className='text-slate-700' value="">Select a tag</option>
                    {tags.map((tag) => (
                      <option className='text-slate-700' key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleTagSubmit}
                    disabled={boostMutation.isLoading}
                    className="bg-slate-700 text-white w-full py-2 rounded-md font-semibold hover:bg-slate-600 transition-colors h-[40px] disabled:bg-slate-400"
                  >
                    {boostMutation.isLoading ? 'Boosting...' : 'Submit'}
                  </button>
                </div>
              )}
              <button
                className="bg-slate-700 text-white w-full py-2 rounded-md font-semibold hover:bg-slate-600 transition-colors h-[40px]"
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

export default CongratulationsModal;