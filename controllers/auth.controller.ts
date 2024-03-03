import { RequestHandler } from 'express';

import { CustomRequest } from '../middlewares/attach-properties.middleware';
import { UserModel } from '../models/user.model';

export const getLogin: RequestHandler = async (req: CustomRequest, res) => {
  res.render(
    'auth/login',
    {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.session.isLoggedIn,
    },
  );
};

export const postLogin: RequestHandler = async (req: CustomRequest, res) => {
  const isAuthSuccess = true;
  if (isAuthSuccess) {
    const user = await UserModel.findById('65d8f9aa317860dc39e9a7cd');
    if (user) {
      req.session.userId = user._id.toString();
      req.session.isLoggedIn = true;
      req.session.save((_err: unknown) => {
        res.redirect('/');
      });
    }
  }
};

export const postLogout: RequestHandler = async (req: CustomRequest, res) => {
  req.session.destroy();
  res.redirect('/');
};
