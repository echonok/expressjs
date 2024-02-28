import { RequestHandler } from 'express';

import { CustomRequest } from '../middlewares/attach-properties.middleware';

export const getLogin: RequestHandler = async (req: CustomRequest, res) => {
  res.render(
    'auth/login',
    {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const postLogin: RequestHandler = async (_req, res) => {
  res.cookie('isLoggedIn', true);
  res.redirect('/');
};
