const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createUser (username, hashedPassword) {
  const sql = `
    INSERT INTO user_info (user_username, user_password)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(sql, [username, hashedPassword]);
  return result.insertId;
}

async function getUserByUsername(username) {
  const sql = `SELECT * FROM user_info WHERE user_username = ?`;
  const [rows] = await pool.execute(sql, [username]);
  return rows[0];
}

async function getUserById(userId) {
  const sql = `SELECT * FROM user_info WHERE user_id = ?`;
  const [rows] = await pool.execute(sql, [userId]);
  return rows[0];
}

module.exports = {
  createUser ,
  getUserByUsername,
  getUserById
};
