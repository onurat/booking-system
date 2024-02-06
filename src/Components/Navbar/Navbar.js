import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="navbar">
      <div className="navbar-title">
        <h1>Booking System</h1>
      </div>
      <nav>
        <ul>
          <li>
            <button onClick={() => handleNavigate('/')}>Calendar</button>
          </li>
          <li>
            <button onClick={() => handleNavigate('/bookings')}>Bookings</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;