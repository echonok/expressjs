import { Router } from 'express';

export const adminRouter = Router();

export const products: { title: string }[] = [];

adminRouter.get('/add-product', (req, res) => {
  res.render(
    'add-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      productCSS: true,
    });
});

adminRouter.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});
