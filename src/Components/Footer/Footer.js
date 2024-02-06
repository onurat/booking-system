import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <p>&copy; {currentYear} Booking System</p>
      <p>
        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
      </p>
    </div>
  );
}

export default Footer;
