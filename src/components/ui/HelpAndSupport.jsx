import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/AuthContext';

const HelpAndSupport = () => {
  const navigate = useNavigate();
const { isLoggedIn, isInitialized } = useAuth();

// 3. The useEffect hook that handles the navigation
useEffect(() => {
  if (isInitialized && !isLoggedIn) {
    navigate("/");
  }
}, [isInitialized, isLoggedIn, navigate]);
  const [openQuestion, setOpenQuestion] = useState('posting-ad');
  const [showFAQ, setShowFAQ] = useState(false);

  const sidebarItems = [
    {
      title: 'Help center',
      subtitle: 'See FAQ and contact support'
    },
    {
      title: 'Rate us',
      subtitle: 'Share your feedback about EXXAA'
    },
    {
      title: 'Invite friends to EXXAA',
      subtitle: 'Refer friends and earn rewards'
    },
    {
      title: 'Become a beta tester',
      subtitle: 'Try new features before release'
    },
    {
      title: 'Version',
      subtitle: 'Check current app version'
    }
  ];

  const faqData = [
    {
      id: 'posting-ad',
      question: 'How do I post an ad?',
      answer: 'To post an ad: 1) Click the "Sell" button in the top navigation 2) Select a category for your item 3) Fill in the item details and upload clear photos 4) Set your price 5) Add your contact details 6) Review all information 7) Click "Post Ad". Your ad will be reviewed and published shortly.'
    },
    {
      id: 'delete-ad',
      question: 'How do I delete or mark my ad as sold?',
      answer: 'To manage your ad: 1) Go to "My Ads" section in your profile 2) Find the ad you want to update 3) Click "Mark as Sold" to mark it as sold, or 4) Click "Delete" to remove the ad completely. Your ad will be immediately removed from search results.'
    },
    {
      id: 'contact-seller',
      question: 'How do I contact a seller?',
      answer: 'You can contact a seller by: 1) Clicking the "Show Phone Number" button on the ad to view contact details 2) Using the "Chat" button to start a conversation through our messaging system 3) Sending your queries through the Q&A section on the ad page.'
    },
    {
      id: 'account-security',
      question: 'How can I keep my account secure?',
      answer: 'Protect your account by: 1) Using a strong password 2) Never sharing your login credentials 3) Being cautious of suspicious messages 4) Enabling two-factor authentication 5) Logging out from shared devices 6) Regularly monitoring your account activity.'
    },
    {
      id: 'trusted-seller',
      question: 'What is a Trusted Seller badge?',
      answer: 'A Trusted Seller badge indicates a reliable seller who: 1) Has completed profile verification 2) Maintains positive buyer ratings 3) Responds quickly to messages 4) Has successfully completed multiple transactions 5) Follows our community guidelines consistently.'
    },
    {
      id: 'report-issue',
      question: 'How do I report a suspicious ad or user?',
      answer: 'To report an issue: 1) Click the "Report" button on the ad or user profile 2) Select the reason for reporting 3) Provide additional details about the issue 4) Submit your report. Our team will investigate and take appropriate action within 24 hours.'
    },
    {
      id: 'safe-trading',
      question: 'What are the safety tips for buying and selling?',
      answer: 'For safe trading: 1) Meet in public places during daylight hours 2) Bring someone with you when meeting 3) Inspect items thoroughly before purchase 4) Use secure payment methods 5) Keep all conversation records 6) Be wary of deals that seem too good to be true 7) Never send payment before receiving items.'
    }
  ];

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="flex min-h-screen bg-offwhite p-4 font-Inter">
      {/* Sidebar */}
      <div className="w-64 bg-offwhite shadow-sm">
        <div className="space-y-1">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              className="p-4 cursor-not-allowed border-b border-gray-500"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-black">{item.title}</h3>
                  <p className="text-xs text-black">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-black" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">Frequently Asked Questions</h1>
            
            <div className="space-y-2">
              {faqData.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                    onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                  >
                    <span className="font-medium text-sm text-left">{faq.question}</span>
                    {openQuestion === faq.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  
                  {openQuestion === faq.id && (
                    <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="min-h-screen bg-offwhite font-Inter p-2">
      {/* Mobile Navigation */}
      <div className="p-4 bg-white shadow-sm">
        <button 
          onClick={() => setShowFAQ(!showFAQ)}
          className="text-sm font-medium text-gray-600 flex items-center justify-between w-full"
        >
          <span className="flex items-center">
            {showFAQ && <ChevronLeft className="h-4 w-4 mr-1" />}
            {showFAQ ? 'Back to Menu' : 'FAQ'}
          </span>
          {!showFAQ && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Conditional rendering based on view state */}
      {!showFAQ ? (
        // Menu Items
        <div className="p-2">
          {sidebarItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg mb-2 shadow-sm"
            >
              <div 
                className="p-3 cursor-pointer"
                onClick={() => item.title === 'Help center' && setShowFAQ(true)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // FAQ Section
        <div className="p-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <h1 className="text-lg font-semibold mb-4">Frequently Asked Questions</h1>
              
              <div className="space-y-2">
                {faqData.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      className="w-full px-3 py-2.5 flex justify-between items-center hover:bg-gray-50"
                      onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                    >
                      <span className="font-medium text-sm text-left pr-2">{faq.question}</span>
                      {openQuestion === faq.id ? (
                        <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                    
                    {openQuestion === faq.id && (
                      <div className="px-3 py-2.5 text-xs leading-relaxed text-gray-600 bg-gray-50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Show Desktop layout for md and above, hide for smaller */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      
      {/* Show Mobile layout for smaller than md, hide for md and above */}
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </>
  );
};

export default HelpAndSupport;
