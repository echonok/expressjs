import { Router } from 'express';
import { getLogin, postLogin } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);
