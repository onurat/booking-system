// Bookings.js
import React, { useState, useEffect } from 'react';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from the database
    // Update bookings state
  }, []);

  return (
    <div className="bookings">
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index}>
            Date: {booking.date.toLocaleDateString()}, Name: {booking.name}, Email: {booking.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bookings;
