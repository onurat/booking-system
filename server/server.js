const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgres://ejgoluto:jYkSgqFIraH6ofWe7psObkQjt-rxVPs0@baasu.db.elephantsql.com/ejgoluto',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

app.get('/api/booking-counts', async (req, res) => {
  try {
    const result = await pool.query('SELECT selected_date, COUNT(*) as count FROM bookings GROUP BY selected_date');
    const bookingCounts = {};
    result.rows.forEach(row => {
      bookingCounts[row.selected_date.toISOString().split('T')[0]] = row.count;
    });
    res.json(bookingCounts);
  } catch (error) {
    console.error('Error fetching booking counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { name, phone, email, selectedDate } = req.body;

  try {
    const existingBookingResult = await pool.query(
      'SELECT COUNT(*) as count FROM bookings WHERE selected_date = $1',
      [selectedDate]
    );

    const existingBookingCount = existingBookingResult.rows[0].count;

    if (existingBookingCount > 0) {
      res.status(409).json({ message: 'A booking already exists for this date. Please choose another date.' });
    } else {

      const result = await pool.query(
        'INSERT INTO bookings (name, phone, email, selected_date) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, phone, email, selectedDate]
      );

      const newBookingId = result.rows[0].id;
      res.status(201).json({ message: 'Booking successful! Your ID is ' + newBookingId });
    }
  } catch (error) {
    console.error('Error inserting booking into the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
