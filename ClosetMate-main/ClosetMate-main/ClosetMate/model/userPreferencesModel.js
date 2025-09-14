// eto yung sa table for user preferences 


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

async function upsertPreference(userId, key, value) {
  // Check if preference exists
  const selectSql = `
    SELECT preference_id FROM user_preferences
    WHERE user_id = ? AND preference_key = ?
  `;
  const [rows] = await pool.execute(selectSql, [userId, key]);

  if (rows.length > 0) {
    // Update existing
    const updateSql = `
      UPDATE user_preferences
      SET preference_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE preference_id = ?
    `;
    const [result] = await pool.execute(updateSql, [value, rows[0].preference_id]);
    return result.affectedRows > 0;
  } else {
    // Insert new
    const insertSql = `
      INSERT INTO user_preferences (user_id, preference_key, preference_value)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(insertSql, [userId, key, value]);
    return result.insertId;
  }
}

async function getPreferencesByUser (userId) {
  const sql = `
    SELECT preference_key, preference_value FROM user_preferences
    WHERE user_id = ?
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
}

async function deletePreference(userId, key) {
  const sql = `
    DELETE FROM user_preferences WHERE user_id = ? AND preference_key = ?
  `;
  const [result] = await pool.execute(sql, [userId, key]);
  return result.affectedRows > 0;
}

module.exports = {
  upsertPreference,
  getPreferencesByUser ,
  deletePreference
};