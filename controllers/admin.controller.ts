import { RequestHandler } from 'express';
import { IProduct, Product } from '../models/product.model';

export const getAddProduct: RequestHandler = async (req, res) => {
  return res.render(
    'admin/add-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      productCSS: true,
    });
}

export const postAddProductView: RequestHandler = async (req, res) => {
  const product = (<IProduct>req.body);
  const newProduct = new Product(product);
  newProduct.save();
  return res.redirect('/');
}

export const getProducts: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
    console.log({ products });
    res.render(
      'admin/products',
      {
        products,
        pageTitle: 'Admin products',
        path: '/admin/products',
        hasProducts: !!products.length,
      }
    )
  });
}
