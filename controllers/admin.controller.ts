import { RequestHandler } from 'express';

import { IProduct, IProductWithId, ProductModel } from '../models/product.model';

export const getAddProduct: RequestHandler = async (_req, res) => {
  return res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      editing: false,
    });
};

export const getEditProduct: RequestHandler<{ productId: string }> = async (req, res) => {
  const productId = req.params.productId;
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.redirect('/');
  }
  res.render(
    'admin/edit-product',
    {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      activeProduct: true,
      editing: true,
      product: product,
    });
};

export const postEditProduct: RequestHandler = async (req, res) => {
  const { _id, ...product } = <IProductWithId>req.body;
  const { userId } = <{ userId: string }>req.headers;
  await ProductModel.findByIdAndUpdate(_id, { ...product, userId }, { upsert: true, new: true });
  return res.redirect('/admin/products');
};

export const deleteProduct: RequestHandler<{ productId: string }> = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  if (productId) {
    await ProductModel.findByIdAndDelete(productId);
  }
  return res.redirect('/admin/products');
};

export const postAddProductView: RequestHandler = async (req, res) => {
  const product = <IProduct>req.body;
  const { userId } = <{ userId: string }>req.headers;
  const newProduct = new ProductModel({ ...product, userId });
  await newProduct.save();
  return res.redirect('/');
};

export const getProducts: RequestHandler = async (_req, res) => {
  const products = await ProductModel.find();
  res.render(
    'admin/products',
    {
      products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    },
  );
};
