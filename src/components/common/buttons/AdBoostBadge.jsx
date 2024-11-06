import React from 'react';
import { 
  CgTrending 
} from 'react-icons/cg';
import { 
  FaStar, 
  FaCheck, 
  FaCrown, 
  FaFire, 
  FaBolt, 
  FaTags, 
  FaThumbsUp, 
  FaShoppingCart, 
  FaExclamation 
} from 'react-icons/fa';

const badgeConfig = {
  'Featured': { color: '#4CAF50', icon: FaStar },
  'featured': { color: '#4CAF50', icon: FaStar },
  'Verified': { color: '#1078c6', icon: FaCheck },
  'verified': { color: '#1078c6', icon: FaCheck },
  'Verified Seller': { color: '#102a69', icon: FaCheck },
  'verified seller': { color: '#102a69', icon: FaCheck },
  'Premium': { color: '#c62540', icon: FaCrown },
  'premium': { color: '#c62540', icon: FaCrown },
  'New Arrival': { color: '#FF9800', icon: FaBolt },
  'new arrival': { color: '#FF9800', icon: FaBolt },
  'Best Seller': { color: '#fc0f0c', icon: FaThumbsUp },
  'best seller': { color: '#fc0f0c', icon: FaThumbsUp },
  'Hot Deal': { color: '#c80e0f', icon: FaFire },
  'hot deal': { color: '#c80e0f', icon: FaFire },
  'Clearance Sale': { color: '#009688', icon: FaTags },
  'clearance sale': { color: '#009688', icon: FaTags },
  'Trending': { color: '#0f0ecf', icon: CgTrending },
  'trending': { color: '#0f0ecf', icon: CgTrending },
  'Popular': { color: '#E91E63', icon: FaThumbsUp },
  'popular': { color: '#E91E63', icon: FaThumbsUp },
  'Best Buy': { color: '#3F51B5', icon: FaShoppingCart },
  'best buy': { color: '#3F51B5', icon: FaShoppingCart },
  'Urgent Sale': { color: '#a863ad', icon: FaExclamation },
  'urgent sale': { color: '#a863ad', icon: FaExclamation },
};

const DEFAULT_BADGE = {
  color: '#9E9E9E',
  icon: FaStar
};

const AdBoostBadge = ({ tag }) => {
  if (!tag) return null;

  // Handle both string and object tag formats
  const tagName = typeof tag === 'object' ? tag?.name : tag;
  
  // If no tagName after processing, return null
  if (!tagName) return null;

  // Normalize tag name to handle case variations
  const normalizedTagName = tagName.trim();
  
  // Get badge config or default
  const badge = badgeConfig[normalizedTagName] || DEFAULT_BADGE;
  const Icon = badge.icon;

  return (
    <div
      className="font-Roboto text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap"
      style={{ backgroundColor: badge.color }}
    >
      <Icon className="w-3 h-3" />
      <span>{tagName}</span>
    </div>
  );
};

export default AdBoostBadge;