import { RequestHandler } from 'express';
import { Product } from '../models/product.model';

export const getAddProduct: RequestHandler = async (req, res) => {
  return res.render(
    'add-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      productCSS: true,
    });
}

export const postAddProductView: RequestHandler = async (req, res) => {
  const product = new Product(req.body.title);
  product.save();
  return res.redirect('/');
}

export const getProducts: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
    console.log({ products });
    res.render(
      'shop',
      {
        products,
        pageTitle: 'Main',
        path: '/',
        hasProducts: !!products.length,
      }
    )
  });
}
