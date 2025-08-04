const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { ifError } = require('node:assert');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'ecommerce',
	password: '17035544',
	port: 5432,
});

app.get('/users', async (req, res) => {
	const { page = 1, limit = 15 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const result = await pool.query(
			'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
			[limit, offset]
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
});

app.get('/users/:id', async (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) {
		return res.status(400).json({ error: 'Invalid ID' });
	}
	try {
		const result = await pool.query('SELECT * FROM users WHERE id = $1', [
			id,
		]);
		if (result.rows.length === 0)
			return res.status(404).json({ error: 'User not found' });
		const orderResult = await pool.query(
			'SELECT COUNT(*) FROM orders WHERE id = $1',
			[id]
		);
		const customer = result.rows[0];
		customer.orderCount = parseInt(orderResult.rows[0].count, 10);
		res.json({ ...customer, orderCount });
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ error: 'Database Error' });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
