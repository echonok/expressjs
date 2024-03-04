import { NextFunction, Response } from 'express';

import { CustomRequest } from './attach-properties.middleware';

export function isAuthMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
}
