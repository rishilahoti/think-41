const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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

app.get('/users/:userId/orders', async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await pool.query(
			'SELECT order_id as id, status, created_at, shipped_at, delivered_at, nums_of_item FROM orders WHERE user_id = $1',
			[userId]
		);
        const orders = result.rows.map(order => ({
            id: order.order_id,
            status: order.status,
            createdAt: order.created_at,
            shippedAt: order.shipped_at,
            deliveredAt: order.delivered_at,
            numsOfItem: order.nums_of_item
        }));
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.listen(4000, () => {
	console.log('Server is running on port 4000');
});
