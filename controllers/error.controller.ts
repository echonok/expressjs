import { RequestHandler } from 'express';
import { CustomRequest } from '../middlewares/attach-properties.middleware';

export const getError: RequestHandler = async (req: CustomRequest, res) => {
  return res.render(
    '404',
    {
      pageTitle: 'Page not found',
      path: null,
      isAuthenticated: req.isLoggedIn,
    });
};
