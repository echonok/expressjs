import { Router } from 'express';
import { getLogin, getSignup, postLogin, postLogout, postSignup } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);

authRouter.post('/logout', postLogout);

authRouter.get('/signup', getSignup);
authRouter.post('/signup', postSignup);
