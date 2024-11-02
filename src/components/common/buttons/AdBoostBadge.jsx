import React from 'react';
import { CgTrending } from 'react-icons/cg';
import { FaStar, FaCheck, FaCrown, FaFire, FaBolt, FaTags, FaThumbsUp, FaShoppingCart, FaExclamation } from 'react-icons/fa';

const badgeConfig = {
  'Featured': { color: '#4CAF50', icon: FaStar },
  'Verified': { color: '#1078c6', icon: FaCheck },
  'Verified Seller': { color: '#102a69', icon: FaCheck },
  'Premium': { color: '#c62540', icon: FaCrown },
  'New Arrival': { color: '#FF9800', icon: FaBolt },
  'Best seller': { color: '#fc0f0c', icon: FaThumbsUp },
  'Hot Deal': { color: '#c80e0f', icon: FaFire },
  'Clearance Sale': { color: '#009688', icon: FaTags },
  'Trending': { color: '#0f0ecf', icon: CgTrending },
  'popular': { color: '#E91E63', icon: FaThumbsUp },
  'Best Buy': { color: '#3F51B5', icon: FaShoppingCart },
  'Urgent Sale': { color: '#a863ad', icon: FaExclamation },
};

function AdBoostBadge({ tag }) {
  // Handle case where tag is an object
  const tagName = typeof tag === 'object' ? tag.name : tag;
  const { color, icon: Icon } = badgeConfig[tagName] || { color: '#9E9E9E', icon: FaStar };

  return (
    <div 
      className='font-Roboto absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded flex items-center'
      style={{ backgroundColor: color }}
    >
      <Icon className="w-3 h-3 mr-1" />
      {tagName}
    </div>
  );
}

export default AdBoostBadge;