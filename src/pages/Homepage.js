import React from 'react';
import Calendar from '../Components/Calendar/Calendar';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage-container">
      <div className="legend-container">
        <div className="legend">
          <h3>Legend</h3>
          <div className="legend-item">
            <div className="legend-color green"></div>
            <div>Available</div>
          </div>
          <div className="legend-item">
            <div className="legend-color orange"></div>
            <div>Almost Full</div>
          </div>
          <div className="legend-item">
            <div className="legend-color red"></div>
            <div>Booked Out</div>
          </div>
        </div>
      </div>
      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
}

export default Homepage;
