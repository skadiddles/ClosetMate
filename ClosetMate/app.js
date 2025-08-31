import express from 'express';
import routeManager from './routes/routeManager.js'
import modelManager from './model/modelManager.js';
// import controllerManager from './controller/controllerManager.js';

const app = express();

app.use(routeManager);
app.use(modelManager);
// app.use(controllerManager);

app.listen(3000, 'localhost');
