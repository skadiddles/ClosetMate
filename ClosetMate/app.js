import express from 'express';
import homeRoutes from './routes/homeRoutes.js'

const app = express();

app.use(homeRoutes);

app.listen(3000, 'localhost');
