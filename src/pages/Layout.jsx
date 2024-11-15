import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/feutures/Navbar';
import CategoryTab from '../components/feutures/CatetogoryTab';
import Footer from '../components/feutures/Footer';
import ShowroomCategoryTab from '../components/feutures/ShowroomCategroyTab';

const Layout = ({ children, onShowPackagesAndOrders }) => {
  const location = useLocation();

  return (
    <div>
      <Navbar onShowPackagesAndOrders={onShowPackagesAndOrders} />
      <CategoryTab />
      <div className='mt-1'>
      {location.pathname === '/' && <ShowroomCategoryTab />}
      </div>
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
