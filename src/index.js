const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("Connected to Neon DB"))
  .catch(err => console.error("Connection error:", err));


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

app.post('/shorten', async (req, res) => {
    const { original_url } = req.body;
    if (!original_url) return res.status(400).json({ error: 'URL required' });

    const short_code = shortid.generate();
    try {
        await pool.query(
            'INSERT INTO links (short_code, original_url) VALUES ($1, $2)',
            [short_code, original_url]
        );
        res.json({ short_url: `${process.env.BASE_URL}/${short_code}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/:short_code', async (req, res) => {
    const { short_code } = req.params;
    try {
        const result = await pool.query(
            'SELECT original_url, clicks FROM links WHERE short_code=$1',
            [short_code]
        );

        if (result.rows.length === 0) return res.status(404).send('Not found');

        const link = result.rows[0];
        await pool.query(
            'UPDATE links SET clicks=$1 WHERE short_code=$2',
            [link.clicks + 1, short_code]
        );

        res.redirect(link.original_url);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
