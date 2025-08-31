import express from 'express';
import homeRouter from './homeRoute.js';
import loginRouter from './loginRoute.js';

const routeManager = express();

routeManager.use(homeRouter);
routeManager.use(loginRouter);

export default routeManager;
