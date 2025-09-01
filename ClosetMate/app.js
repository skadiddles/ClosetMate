import express from 'express';
import routeManager from './routes/routeManager.js'
import {pool} from './model/loginModel.js';


// import modelManager from './model/modelManager.js';
// import controllerManager from './controller/controllerManager.js';

const app = express();
pool;

app.use(routeManager);
// app.use(modelManager);
// app.use(controllerManager);

app.listen(3000, 'localhost');
