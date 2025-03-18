// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './Navbar.css';

import graphIcon from './NavbarIcons/graph.png';
import listIcon from './NavbarIcons/list.png';
import plusIcon from './NavbarIcons/plus.png';
import logoutIcon from './NavbarIcons/logout.png';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Financial Tracker App</div>
      <ul className="navbar-links">
        <li>
          <Link to="/home" data-tooltip-id="homeTip">
            <img src={graphIcon} alt="Home" className="navbar-icon" />
          </Link>
          <Tooltip id="homeTip" place="bottom" content="Home" />
        </li>
        <li>
          <Link to="/transactions" data-tooltip-id="transactionsTip">
            <img src={listIcon} alt="Transações" className="navbar-icon" />
          </Link>
          <Tooltip id="transactionsTip" place="bottom" content="Transações" />
        </li>
        <li>
          <Link to="/create-transaction" data-tooltip-id="createTip">
            <img src={plusIcon} alt="Criar Transação" className="navbar-icon" />
          </Link>
          <Tooltip id="createTip" place="bottom" content="Criar Transação" />
        </li>
        <li>
          <button onClick={handleLogout} className="navbar-logout-button" data-tooltip-id="logoutTip">
            <img src={logoutIcon} alt="Logout" className="navbar-icon" />
          </button>
          <Tooltip id="logoutTip" place="bottom" content="Logout" />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
