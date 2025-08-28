import express from 'express';
import path from 'path';
import { __dirname } from './../utils/dirname.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/frontend/index.html'));
});



export default router;
