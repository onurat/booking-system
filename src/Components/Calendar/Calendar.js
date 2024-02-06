import React, { useState, useEffect } from 'react';
import BookingForm from '../BookingsForm/BookingForm';
import './Calendar.css';

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState({});
  const [bookingFormDate, setBookingFormDate] = useState(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [bookingSuccessful, setBookingSuccessful] = useState(false); 

  const fetchHighlightedDates = async () => {
    try {
      const bookingCountResponse = await fetch('https://booking-system-api-oo1q.onrender.com/api/booking-counts');


      if (bookingCountResponse.ok) {
        const bookingCountData = await bookingCountResponse.json();

        const updatedHighlightedDates = {};
        
        for (const dateStr in bookingCountData) {
          const count = bookingCountData[dateStr] || 0;
          if (count === 0) {
            updatedHighlightedDates[dateStr] = 'green';
          } else if (count >= 5) {
            updatedHighlightedDates[dateStr] = 'red';
          } else if (count >= 2) {
            updatedHighlightedDates[dateStr] = 'orange';
          } else {
            updatedHighlightedDates[dateStr] = 'green';
          }
        }

        setHighlightedDates(updatedHighlightedDates);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchHighlightedDates();
  }, []);

  const handleBook = async (bookingData) => {
    try {
      const response = await fetch('https://booking-system-api-oo1q.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      if (response.ok) {
        await fetchHighlightedDates();
        setBookingSuccessful(true);
      }
    } finally {
      window.location.reload(); 
      setBookingFormDate(null);
      setIsBookingFormOpen(false);
    }
  };
  
  
  
  const handleDateClick = (clickedDate) => {
    setBookingFormDate(clickedDate);
    setIsBookingFormOpen(true);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.calendar') && !e.target.closest('.booking-form')) {
      setIsBookingFormOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const calendarRows = [];

  let dayCount = 1;
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      let keyForDay;
      if ((i === 0 && j < date.getDay()) || dayCount > daysInMonth) {
        keyForDay = `empty-${i}-${j}`;
        row.push(<div key={keyForDay} className="calendar-day empty">{""}</div>);
      } else {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), dayCount);
        const isHighlighted = highlightedDates[currentDate.toISOString().split('T')[0]];
        keyForDay = `day-${i}-${j}-${dayCount}`;
        row.push(
          <div
            key={keyForDay}
            className={`calendar-day ${isHighlighted ? isHighlighted : ''}`}
            onClick={() => handleDateClick(currentDate)}
          >
            {dayCount}
          </div>
        );
        dayCount++;
      }
    }
    calendarRows.push(<div key={`row-${i}`} className="calendar-row">{row}</div>);
  }

  useEffect(() => {
    if (bookingSuccessful) {
      alert("Your booking is successful");
      setBookingSuccessful(false);
    }
  }, [bookingSuccessful]);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}>&lt;</button>
        <span>{date.toLocaleString('en-GB', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}>&gt;</button>
      </div>
      <div className="calendar-days-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div className="calendar-day-header" key={index}>{day}</div>
        ))}
      </div>
      <div className="calendar-body">{calendarRows}</div>
      {bookingFormDate && isBookingFormOpen && (
        <BookingForm
          date={bookingFormDate}
          onBook={handleBook}
          className={isBookingFormOpen ? 'active' : ''}
        />
      )}
    </div>
  );
}

export default Calendar;
