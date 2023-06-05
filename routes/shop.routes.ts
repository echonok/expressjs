import { Router } from 'express';
import path from 'path';

import { rootDir } from '../app';
import { products } from './admin.routes';

export const shopRouter = Router();

shopRouter.get('/', (req, res) => {
  console.log({ products });
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', { products, pageTitle: 'Main', path: '/' });
});
