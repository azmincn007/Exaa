import { Button, Input, Tabs, TabList, Tab } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../../constants/logoimg'
import SearchComponent from '../../components/Specific/Navbar/SearchComponent'
import SearchImageGallery from './SearchImageGaller'
import { useState } from 'react'


export default function Header() {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <nav className="fixed top-0 left-0 right-0 flex h-16 items-center justify-between px-4 md:px-6 bg-white z-50">
        <div>
        <Link to="/">
      <img className="h-[40px]" src={IMAGES.exxaa} alt="Logo" />
    </Link>
        </div>

    <div className='flex gap-4 items-center'>
    <Tabs index={activeTabIndex} onChange={(index) => setActiveTabIndex(index)} variant="unstyled">
      <TabList className="hidden space-x-2 md:flex">
        <Tab
          onClick={() => window.location.href = '/image-gallery'}
          className={`text-sm font-medium transition-colors hover:text-gray-900 ${
            activeTabIndex === 0 ? 'bg-[#E5E5E5] rounded-md' : 'text-gray-700'
          }`}
        >
          Home
        </Tab>
        <Tab
          onClick={() => window.location.href = '/image-gallery'}
          className={`text-sm font-medium transition-colors hover:text-gray-900 ${
            activeTabIndex === 1 ? 'bg-[#E5E5E5] rounded-md' : 'text-gray-700'
          }`}
        >
          Category
        </Tab>
      </TabList>
    </Tabs>
    <div className=" items-center gap-2">
      <SearchImageGallery />
    </div>
    </div>
   
  </nav>
  )
}

