import { RequestHandler } from 'express';

import { IProduct, IProductWithId, ProductModel } from '../models/product.model';
import { CustomRequest } from '../middlewares/attach-properties.middleware';
import { UserModel } from '../models/user.model';

export const getAddProduct: RequestHandler = async (req: CustomRequest, res) => {
  return res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      editing: false,
      isAuthenticated: req.session.isLoggedIn,
    });
};

export const getEditProduct: RequestHandler = async (req: CustomRequest, res) => {
  const { productId } = <{ productId: string }>req.params;
  console.log({ productId });
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
      isAuthenticated: req.session.isLoggedIn,
    });
};

export const postEditProduct: RequestHandler = async (req: CustomRequest, res) => {
  const { _id, ...product } = <IProductWithId>req.body;
  const { userId } = req.session;
  const foundProduct = await ProductModel.findById(_id);
  if (!foundProduct || foundProduct.userId.toString() !== userId) {
    return res.redirect('/');
  }
  await ProductModel.findByIdAndUpdate({ _id: _id }, { ...product, userId }, { upsert: true, new: true });
  return res.redirect('/admin/products');
};

export const deleteProduct: RequestHandler = async (req: CustomRequest, res) => {
  const { productId } = (<{ productId: string }>req.body);
  const { userId } = req.session;
  const foundProduct = await ProductModel.findById(productId);
  if (!foundProduct || foundProduct.userId.toString() !== userId) {
    return res.redirect('/');
  }
  await ProductModel.findByIdAndDelete(productId);
  return res.redirect('/admin/products');
};

export const postAddProductView: RequestHandler = async (req: CustomRequest, res) => {
  const product = <IProduct>req.body;
  const { userId } = req.session;
  const newProduct = new ProductModel({ ...product, userId });
  await newProduct.save();
  return res.redirect('/');
};

export const getProducts: RequestHandler = async (req: CustomRequest, res) => {
  const products = await ProductModel.find({ userId: req.session.userId });
  res.render(
    'admin/products',
    {
      products,
      pageTitle: 'Admin products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn,
    },
  );
};
