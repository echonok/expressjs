import { Router } from 'express';
import { body, check } from 'express-validator';

import {
  getLogin,
  getReset,
  getSignup,
  postLogin,
  postLogout,
  postReset,
  postSignup,
  getNewPassword,
  postNewPassword,
} from '../controllers/auth.controller';
import { UserModel } from '../models/user.model';

export const authRouter = Router();

authRouter.get('/login', getLogin);
authRouter.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a correct email')
      .custom(async (value) => {
        const foundUser = await UserModel.findOne({ email: value });
        if (!foundUser) {
          throw new Error('Invalid email or password');
        }
      })
      .normalizeEmail()
      .trim(),
    body('password', 'Please provide password at least 5 symbols and so on').trim().isLength({ min: 5 }).isAlphanumeric(),
  ],
  postLogin,
);

authRouter.post('/logout', postLogout);

authRouter.get('/signup', getSignup);
authRouter.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a correct email')
      .custom(async (value) => {
        const foundUser = await UserModel.findOne({ email: value });
        if (foundUser) {
          throw new Error('User is already exist');
        }
      })
      .normalizeEmail()
      .trim(),
    body('password', 'Please provide password at least 5 symbols and so on').trim().isLength({ min: 5 }).isAlphanumeric(),
    body('confirmPassword').trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match');
      }
      return true;
    }),
  ],
  postSignup,
);

authRouter.get('/reset', getReset);
authRouter.post('/reset', postReset);

authRouter.get('/new-password/:token', getNewPassword);
authRouter.post('/new-password', postNewPassword);
