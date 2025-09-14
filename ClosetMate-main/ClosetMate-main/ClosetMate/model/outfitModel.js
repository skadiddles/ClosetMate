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

async function createOutfit(userId, name, description = null) {
  const sql = `
    INSERT INTO outfits (user_id, name, description)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(sql, [userId, name, description]);
  return result.insertId;
}

async function getOutfitsByUser (userId) {
  const sql = `SELECT * FROM outfits WHERE user_id = ?`;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
}

async function getOutfitById(userId, outfitId) {
  const sql = `SELECT * FROM outfits WHERE user_id = ? AND outfit_id = ?`;
  const [rows] = await pool.execute(sql, [userId, outfitId]);
  return rows[0];
}

async function updateOutfit(userId, outfitId, updateData) {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = ?`);
    params.push(value);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  params.push(userId, outfitId);

  const sql = `
    UPDATE outfits
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND outfit_id = ?
  `;

  const [result] = await pool.execute(sql, params);
  return result.affectedRows > 0;
}

async function deleteOutfit(userId, outfitId) {
  const sql = `DELETE FROM outfits WHERE user_id = ? AND outfit_id = ?`;
  const [result] = await pool.execute(sql, [userId, outfitId]);
  return result.affectedRows > 0;
}

module.exports = {
  createOutfit,
  getOutfitsByUser ,
  getOutfitById,
  updateOutfit,
  deleteOutfit
};