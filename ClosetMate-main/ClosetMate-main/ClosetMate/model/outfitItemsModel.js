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

async function addItemToOutfit(outfitId, itemId) {
  const sql = `
    INSERT INTO outfit_items (outfit_id, item_id)
    VALUES (?, ?)
  `;
  try {
    const [result] = await pool.execute(sql, [outfitId, itemId]);
    return result.affectedRows > 0;
  } catch (err) {
    // Handle duplicate entry error or others
    if (err.code === 'ER_DUP_ENTRY') {
      return false; // Item already linked
    }
    throw err;
  }
}

async function removeItemFromOutfit(outfitId, itemId) {
  const sql = `
    DELETE FROM outfit_items WHERE outfit_id = ? AND item_id = ?
  `;
  const [result] = await pool.execute(sql, [outfitId, itemId]);
  return result.affectedRows > 0;
}

async function getItemsByOutfit(outfitId) {
  const sql = `
    SELECT ci.* FROM clothing_items ci
    JOIN outfit_items oi ON ci.item_id = oi.item_id
    WHERE oi.outfit_id = ?
  `;
  const [rows] = await pool.execute(sql, [outfitId]);
  return rows;
}

module.exports = {
  addItemToOutfit,
  removeItemFromOutfit,
  getItemsByOutfit
};