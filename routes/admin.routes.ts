import { Router } from 'express';
import path from 'path';

import { rootDir } from '../app';

export const adminRouter = Router();

export const products: { title: string }[] = [];

adminRouter.get('/add-product', (req, res) => {
  console.log('middleware 1')
  console.log({ rootDir })
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

adminRouter.post('/add-product', (req, res) => {
  console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect('/');
});
