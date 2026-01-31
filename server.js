// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host:"auth-db1827.hstgr.io", //// process.env.DB_HOST
  user: "u599556397_call_log",//process.env.DB_USER
  password: "Sapital@123",//process.env.DB_PASSWORD
  database: "u599556397_call_log_app"//process.env.DB_NAME
});

// Sample endpoint: Get all users
app.get('/api/users', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users');
  res.json(rows);
});

// Sample endpoint: Get call stats per user
app.get('/api/stats/users', async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.employee_id, u.full_name, COUNT(c.call_id) AS total_calls, SUM(c.duration) AS total_duration
    FROM users u
    JOIN devices d ON u.user_id = d.user_id
    JOIN call_history c ON d.device_id = c.device_id
    GROUP BY u.employee_id, u.full_name
  `);
  res.json(rows);
});

app.listen(5000, () => console.log('API running on port 5000'));
