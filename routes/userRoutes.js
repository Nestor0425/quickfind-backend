import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

// Esta ruta está protegida: primero se verifica el token y se asigna req.userID y req.userRole
userRouter.get('/data', userAuth, getUserData);

export default userRouter;