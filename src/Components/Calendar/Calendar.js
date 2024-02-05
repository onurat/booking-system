import React, { useState, useEffect } from 'react';
import BookingForm from '../BookingsForm/BookingForm';
import './Calendar.css';

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState({});
  const [bookingFormDate, setBookingFormDate] = useState(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const fetchHighlightedDates = async () => {
    try {
      const response = await fetch('/api/highlighted-dates');
      if (response.ok) {
        const data = await response.json();
        setHighlightedDates(data);
      }
    } catch (error) {
      console.error('Error fetching highlighted dates:', error);
    }
  };

  useEffect(() => {
    fetchHighlightedDates();
  }, []);

  const handleBook = async (bookingData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        await fetchHighlightedDates();
      } else {
        console.error('Error submitting booking.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }

    setBookingFormDate(null);
    setIsBookingFormOpen(false);
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
        const isHighlighted = highlightedDates[currentDate.toDateString()];
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

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}>&lt;</button>
        <span>{date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
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
