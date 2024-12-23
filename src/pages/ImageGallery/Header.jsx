import { Button, Input, Tabs, TabList, Tab } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { IMAGES } from '../../constants/logoimg'
import SearchComponent from '../../components/Specific/Navbar/SearchComponent'
import SearchImageGallery from './SearchImageGaller'


export default function Header({ activeTabIndex, setActiveTabIndex, isHomeRoute }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 flex py-4 items-center justify-between px-4 md:px-6 bg-white z-50">
        <div className="flex flex-col md:flex-row justify-between w-full md:gap-8 gap-4">
            <div className="flex justify-between w-full ">
                <Link to="/">
                    <img className="w-[95px] h-[27px] md:w-[120px] md:h-[35px]" src={IMAGES.exxaa} alt="Logo" />
                </Link>
                <div className='flex gap-4 items-center'>
                    <Tabs index={activeTabIndex} onChange={(index) => setActiveTabIndex(index)} variant="unstyled">
                        <TabList className="space-x-2 flex">
                            <Tab
                                onClick={() => navigate('/')}
                                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                                    activeTabIndex === 0 ? 'bg-[#E5E5E5] rounded-md' : 'text-gray-700'
                                }`}
                            >
                                Home
                            </Tab>
                            <Tab
                                onClick={() => {
                                    setActiveTabIndex(1);
                                    navigate('/image-gallery/category');
                                }}
                                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                                    activeTabIndex === 1 ? 'bg-[#E5E5E5] rounded-md' : 'text-gray-700'
                                }`}
                            >
                                Category
                            </Tab>
                        </TabList>
                    </Tabs>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
                {!isHomeRoute && <SearchImageGallery />}
            </div>
        </div>
    </nav>
  )
}

