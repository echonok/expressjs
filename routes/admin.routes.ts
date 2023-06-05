import { Router } from 'express';
import path from 'path';

import { rootDir } from '../app';

export const adminRouter = Router();

export const products: { title: string }[] = [];

adminRouter.get('/add-product', (req, res) => {
  res.render('add-product', { pageTitle: 'Add product', path:'/admin/add-product' });
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

adminRouter.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});
