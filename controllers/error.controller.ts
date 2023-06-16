import { RequestHandler } from 'express';

export const getError: RequestHandler = async (req, res) => {
  return res.render('404', { pageTitle: 'Page not found', path: null })
}
