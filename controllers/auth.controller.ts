import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';

import { CustomRequest } from '../middlewares/attach-properties.middleware';
import { UserModel } from '../models/user.model';

export const getLogin: RequestHandler = async (req: CustomRequest, res) => {
  const flashMessage = req.flash('error').join();
  const message = flashMessage === '' ? null : flashMessage;
  res.render(
    'auth/login',
    {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
      isAuthenticated: req.session.isLoggedIn,
    },
  );
};

export const postLogin: RequestHandler = async (req: CustomRequest, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).lean();
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }
  req.session.userId = user._id.toString();
  req.session.isLoggedIn = true;
  req.session.save((_err: unknown) => {
    res.redirect('/');
  });
};

export const postLogout: RequestHandler = async (req: CustomRequest, res) => {
  req.session.destroy();
  res.redirect('/');
};

export const getSignup: RequestHandler = async (req, res) => {
  const flashMessage = req.flash('error').join();
  const message = flashMessage === '' ? null : flashMessage;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    isAuthenticated: false,
  });
};

export const postSignup: RequestHandler = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const foundUser = await UserModel.findOne({ email });
  if (foundUser) {
    req.flash('error', 'User is already exist');
    return res.redirect('/signup');
  }
  const encryptedPassword = await bcrypt.hash(password, 12);
  const newUser = new UserModel({
    email,
    password: encryptedPassword,
  });
  await newUser.save();
  return res.redirect('/login');
};
