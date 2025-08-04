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
});

app.get('/users', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM users');
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
});

app.get('/users/:id/orders', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			'SELECT * FROM orders WHERE id = $1',
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
