import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/feutures/Navbar';
import CategoryTab from '../components/feutures/CatetogoryTab';
import Footer from '../components/feutures/Footer';
import ShowroomCategoryTab from '../components/feutures/ShowroomCategroyTab';
import DownloadDiv from '../components/Specific/Landing/Downlaoddiv';//+

const Layout = ({ children, onShowPackagesAndOrders }) => {
  const location = useLocation();

  return (
    <div>
      <Navbar onShowPackagesAndOrders={onShowPackagesAndOrders} />
      <CategoryTab />
      <div className='mt-1'>
      {<ShowroomCategoryTab />}
    
      </div>
      <div>{children}</div>
      <DownloadDiv />
      <Footer />
    </div>
  );
};

export default Layout;
