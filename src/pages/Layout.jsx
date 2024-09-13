import React from 'react';
import Navbar from '../components/feutures/Navbar';
import CategoryTab from '../components/feutures/CatetogoryTab';
import Footer from '../components/feutures/Footer';

const Layout = ({ children, onShowPackagesAndOrders }) => {
  return (
    <div>
      <Navbar onShowPackagesAndOrders={onShowPackagesAndOrders} />
      <CategoryTab />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
