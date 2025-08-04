const express = require('express');
const { Pool } = require('pg');


const app = express();
app.use(express.json());

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'ecommerce',
	password: '17035544',
	port: 5432,
});

app.get('/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Database Error' });
    }
})

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Database Error' });
    }
})

app.get('/orders/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database Error' });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})