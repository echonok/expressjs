import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  isLoggedIn: boolean;
  isAuthenticated?: boolean;
  session: any;
}

export function attachProperties(req: CustomRequest, _res: Response, next: NextFunction) {
  req.isLoggedIn = req.cookies.isLoggedIn === 'true';
  next();
}
