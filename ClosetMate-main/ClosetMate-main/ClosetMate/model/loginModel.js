import express from 'express';
import sql from 'mysql2';
import dotenv from 'dotenv';
import crypto from 'crypto';

const model = express.Router(); // An express router
dotenv.config();

// Pool of connections (Just one this time tho)
export const pool = sql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// For hashing passwords
export function hashPassword(user_password)
{
    return crypto.createHash('sha256').update(user_password).digest('hex');
}

// Gets info about a row based on User ID
export async function getRow(id)
{
    const [result] = await pool.query('SELECT * FROM user_info WHERE user_id=?',[id]);
    return result[0];
}

// Create Account
export async function createUser(user_username, user_password)
{
    user_password = hashPassword(user_password);
    const insertResult = await pool.query(`
        INSERT INTO user_info(user_username, user_password)
        VALUES (?, ?);`, [user_username, user_password]); // insertResult is just metadata
   return insertResult; 
}

// Verify Account Credentials
export async function verifyLogin(user_username, user_password)
{

    const [selection] = await pool.query(`
        SELECT * FROM user_info WHERE user_username = ?`, [user_username]);
    
    if(selection.length === 0){return false;} // 

    const selectionObj = selection[0];
    user_password = hashPassword(user_password);

    return selectionObj.user_password === user_password;
}

// Reset User Password
export async function resetPassword(user_username){
    
}

// const user_info = await getRow(1);
// console.log(`Password: ${user_info.user_password}`);

// await createUser('john', 'doe');

// // Export the router
// export default model; // Allows other files to read it and be able to set any name to it because it is set as default.
