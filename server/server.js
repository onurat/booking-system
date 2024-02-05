const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const pool = new Pool({
  user: 'ejgoluto',
  host: 'baasu.db.elephantsql.com',
  database: 'ejgoluto',
  password: 'jYkSgqFIraH6ofWe7psObkQjt-rxVPs0',
  port: 5432,
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
