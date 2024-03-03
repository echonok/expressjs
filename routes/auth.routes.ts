import { Router } from 'express';
import { getLogin, postLogin, postLogout } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);
authRouter.post('/logout', postLogout);
