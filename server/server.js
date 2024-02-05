const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'ejgoluto',
  host: 'baasu.db.elephantsql.com',
  database: 'ejgoluto',
  password: 'jYkSgqFIraH6ofWe7psObkQjt-rxVPs0',
  port: 5432,
});

app.get('/api/highlighted-dates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM highlighted_dates');
    const highlightedDates = {};
    result.rows.forEach(row => {
      highlightedDates[row.date.toISOString().split('T')[0]] = row.color;
    });
    res.json(highlightedDates);
  } catch (error) {
    console.error('Error fetching highlighted dates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { name, phone, email, selectedDate } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO bookings (name, phone, email, selected_date) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, phone, email, selectedDate]
    );

    const newBookingId = result.rows[0].id;
    res.status(201).json({ id: newBookingId });
  } catch (error) {
    console.error('Error inserting booking into the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// This route will handle any requests not handled by the previous routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
