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


async function addClothingItem(userId, itemData) {
  const {
    name,
    category,
    type,
    color,
    material,
    image_url,
    season,
    occasion,
    last_worn_date,
    wear_count = 0
  } = itemData;

  const sql = `
    INSERT INTO clothing_items
    (user_id, name, category, type, color, material, image_url, season, occasion, last_worn_date, wear_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    name,
    category,
    type,
    color,
    material,
    image_url,
    season,
    occasion,
    last_worn_date || null,
    wear_count
  ];

  const [result] = await pool.execute(sql, params);
  return result.insertId;
}


async function getClothingItemsByUser (userId) {
  const sql = `SELECT * FROM clothing_items WHERE user_id = ?`;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
}


async function getClothingItemById(userId, itemId) {
  const sql = `SELECT * FROM clothing_items WHERE user_id = ? AND item_id = ?`;
  const [rows] = await pool.execute(sql, [userId, itemId]);
  return rows[0];
}

async function updateClothingItem(userId, itemId, updateData) {
 
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = ?`);
    params.push(value);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  params.push(userId, itemId);

  const sql = `
    UPDATE clothing_items
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND item_id = ?
  `;

  const [result] = await pool.execute(sql, params);
  return result.affectedRows > 0;
}


async function deleteClothingItem(userId, itemId) {
  const sql = `DELETE FROM clothing_items WHERE user_id = ? AND item_id = ?`;
  const [result] = await pool.execute(sql, [userId, itemId]);
  return result.affectedRows > 0;
}

module.exports = {
  addClothingItem,
  getClothingItemsByUser ,
  getClothingItemById,
  updateClothingItem,
  deleteClothingItem
};
