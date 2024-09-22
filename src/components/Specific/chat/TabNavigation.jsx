import { NavLink } from "react-router-dom";

const TabNavigation = ({ activeTab, onTabChange }) => (
    <div className="flex bg-white">
      {['all', 'buying', 'selling'].map((tab) => (
        <NavLink
          key={tab}
          to={`/chats/${tab}`}
          className={({ isActive }) => `flex-1 py-2 text-center ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}
          onClick={() => onTabChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </NavLink>
      ))}
    </div>
  );

  export default TabNavigation