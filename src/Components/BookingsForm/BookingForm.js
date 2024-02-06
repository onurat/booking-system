import React, { useState } from 'react';
import './BookingsForm.css';

function BookingForm({ date, onBook, className }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const phonePattern = /^\d{10}$/;
    if (!phone.match(phonePattern)) {
      alert("Please enter a valid phone number (10 digits).");
      setIsSubmitting(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailPattern)) {
      alert("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!name || !phone || !email) {
      alert("Please fill out all fields.");
      setIsSubmitting(false);
      return;
    }

    const bookingData = {
      name,
      phone,
      email,
      selectedDate: date.toISOString().split('T')[0],
    };

    try {
      const response = await fetch('https://booking-system-api-oo1q.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (response.ok) {
        alert("Your booking is successful");
        onBook(bookingData);
        setName('');
        setPhone('');
        setEmail('');
      } else if (response.status === 409) {
        setIsDateAvailable(false);
      } else {
        console.error('Error submitting booking.');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`booking-form ${className}`}>
      <h2>Book a Slot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={phone}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
        />
        <div className="date-picker">
          <label>Selected Date:</label>
          <input
            type="date"
            name="selectedDate"
            value={date.toISOString().split('T')[0]}
            readOnly
          />
        </div>
        {!isDateAvailable && (
          <p className="error">This date is already booked. Please choose another date.</p>
        )}
        <button type="submit" disabled={!isDateAvailable || isSubmitting}>
          Book
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
