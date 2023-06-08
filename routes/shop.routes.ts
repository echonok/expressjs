import { Router } from 'express';

import { products } from './admin.routes';

export const shopRouter = Router();

shopRouter.get('/', (req, res) => {
  console.log({ products });
  res.render(
    'shop',
    {
      products,
      pageTitle: 'Main',
      path: '/',
      hasProducts: !!products.length,
      activeShop: true,
      productCSS: true,
    }
  );
});
