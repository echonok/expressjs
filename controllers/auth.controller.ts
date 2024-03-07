import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { CustomRequest } from '../middlewares/attach-properties.middleware';
import { UserModel } from '../models/user.model';
import dayjs from 'dayjs';

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

export const getReset: RequestHandler = async (req, res) => {
  const flashMessage = req.flash('error').join();
  const message = flashMessage === '' ? null : flashMessage;
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage: message,
    isAuthenticated: false,
  });
};

export const postReset: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const tokenBuffer = crypto.randomBytes(32);
  if (!tokenBuffer) {
    req.flash('error', 'Failed to generate reset token');
    return res.redirect('/reset');
  }
  const token = tokenBuffer.toString('hex');
  const foundUser = await UserModel.findOne({ email });
  if (!foundUser) {
    req.flash('error', 'No user with this email');
    return res.redirect('/reset');
  }
  foundUser.resetToken = token;
  foundUser.resetTokenExp = dayjs().add(1, 'hour').toDate();
  await foundUser.save();
  console.log(`http://localhost:8000/new-password/${token}`);
  return res.redirect('/login');
};

export const getNewPassword: RequestHandler<{ token: string }> = async (req, res) => {
  const foundUser = await UserModel.findOne({
    resetToken: req.params.token,
    resetTokenExp: { $gt: Date.now() },
  }).lean();
  if (!foundUser) {
    req.flash('error', 'Old token');
    res.redirect('/login');
  }
  const flashMessage = req.flash('error').join();
  const message = flashMessage === '' ? null : flashMessage;
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New password',
    errorMessage: message,
    userId: foundUser._id.toString(),
    passwordToken: req.params.token,
    isAuthenticated: false,
  });
};

export const postNewPassword: RequestHandler = async (req, res) => {
  const { password, userId, passwordToken } = req.body;
  const foundUser = await UserModel.findOne({ resetToken: passwordToken, resetTokenExp: { $gt: Date.now() } });
  if (!foundUser) {
    req.flash('error', 'Old token');
    res.redirect('/login');
  }
  foundUser.password = await bcrypt.hash(password, 12);
  foundUser.resetToken = null;
  foundUser.resetTokenExp = null;
  await foundUser.save();
  res.redirect('/login');
};
