import { Router } from 'express';
import {
  getLogin,
  getReset,
  getSignup,
  postLogin,
  postLogout,
  postReset,
  postSignup, getNewPassword, postNewPassword,
} from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.get('/login', getLogin);
authRouter.post('/login', postLogin);

authRouter.post('/logout', postLogout);

authRouter.get('/signup', getSignup);
authRouter.post('/signup', postSignup);

authRouter.get('/reset', getReset);
authRouter.get('/new-password/:token', getNewPassword);
authRouter.post('/new-password', postNewPassword);
authRouter.post('/reset', postReset);
