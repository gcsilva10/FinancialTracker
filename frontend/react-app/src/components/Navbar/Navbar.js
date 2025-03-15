// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

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
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/transactions">Transações</Link></li>
        <li><Link to="/create-transaction">Criar Transação</Link></li>
        <li>
          <button onClick={handleLogout} className="navbar-logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
