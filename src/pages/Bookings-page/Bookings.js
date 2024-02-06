import React, { useState, useEffect } from 'react';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('https://booking-system-api-oo1q.onrender.com/api/bookings
      ');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <div className="bookings-container">
      <h2>Bookings</h2>
      <p className="booking-info">
        Welcome to the bookings page! Here you can view all the bookings made by our customers.
        Each booking includes the date, name, and email of the customer.
      </p>
      <div className="bookings-box">
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={index} className="booking-item">
                <div>Date: {new Date(booking.selected_date).toLocaleDateString()}</div>
                <div>Name: {booking.name}</div>
                <div>Email: {booking.email}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bookings">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default Bookings;
