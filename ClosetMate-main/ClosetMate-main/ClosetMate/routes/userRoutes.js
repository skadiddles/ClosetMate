const express = require('express');
const router = express.Router();
const userModel = require('./userModel');
const bcrypt = require('bcrypt');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    // Check if user exists
    const existingUser  = await userModel.getUserByUsername(username);
    if (existingUser ) return res.status(409).json({ error: 'Username already taken' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await userModel.createUser (username, hashedPassword);
    res.status(201).json({ message: 'User  registered', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User  not found' });

    // Exclude password from response
    const { user_password, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

module.exports = router;
