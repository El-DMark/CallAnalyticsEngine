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
  const [rows] = await db.query('SELECT u.*, d.device_id FROM users u Left JOIN devices d ON u.user_id = d.user_id');
  res.json(rows);
});

// Sample endpoint: Get call stats per user
app.get('/api/stats/users', async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.employee_id, u.full_name,d.device_id, COUNT(c.call_id) AS total_calls, SUM(c.duration) AS total_duration
    FROM users u
    JOIN devices d ON u.user_id = d.user_id
    JOIN call_history c ON d.device_id = c.device_id
    GROUP BY u.employee_id, u.full_name, d.device_id
  `);
  res.json(rows);
});

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const { user_id, employee_id, full_name, email, mobile_no, password_hash } = req.body;

    const [result] = await db.query(
      `INSERT INTO users (user_id, employee_id, full_name, email, mobile_no, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, employee_id, full_name, email, mobile_no, password_hash]
    );

    res.status(201).json({ message: 'User added successfully', insertId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Add a new device
app.post('/api/devices', async (req, res) => {
  try {
    const { device_id, user_id, device_type, device_model, phone_number } = req.body;

    const [result] = await db.query(
      `INSERT INTO devices (device_id, user_id, device_type, device_model, phone_number)
       VALUES (?, ?, ?, ?, ?)`,
      [device_id, user_id, device_type, device_model, phone_number]
    );

    res.status(201).json({ message: 'Device added successfully', insertId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});

// Add a new call record
app.post('/api/calls', async (req, res) => {
  try {
    const { call_id, device_id, employee_id, call_type, call_status, duration, timestamp, contact_number, contact_name } = req.body;

    const [result] = await db.query(
      `INSERT INTO call_history (call_id, device_id, employee_id, call_type, call_status, duration, timestamp, contact_number, contact_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [call_id, device_id, employee_id, call_type, call_status, duration, timestamp, contact_number, contact_name]
    );

    res.status(201).json({ message: 'Call record added successfully', insertId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add call record' });
  }
});


app.listen(5000, () => console.log('API running on port 5000'));
