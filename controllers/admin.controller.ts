import { RequestHandler } from 'express';

import { IProduct, Product } from '../models/product.model';
import { where } from 'sequelize';

export const getAddProduct: RequestHandler = async (req, res) => {
  return res.render(
    'admin/edit-product',
    {
      pageTitle: 'Add product',
      path: '/admin/add-product',
      activeProduct: true,
      editing: false,
    });
}

export const getEditProduct: RequestHandler<{ productId: string }> = async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId);
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
}

export const postEditProduct: RequestHandler = async (req, res) => {
  const product = (<IProduct>req.body);
  const foundProduct = await Product.findByPk(product.id);
  if (!foundProduct) {
    return res.redirect('/');
  }
  foundProduct.price = product.price;
  foundProduct.description = product.description;
  foundProduct.title = product.title;
  foundProduct.imageUrl = product.imageUrl;
  await foundProduct.save();
  return res.redirect('/admin/products');
}

export const deleteProduct: RequestHandler<{ productId: string }> = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  if (productId) {
    await Product.destroy({ where: { id: productId } })
  }
  return res.redirect('/admin/products');
}

export const postAddProductView: RequestHandler = async (req, res) => {
  const product = (<IProduct>req.body);
  await Product.create({
    title: product.title,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
  });
  return res.redirect('/');
}

export const getProducts: RequestHandler = async (req, res) => {
  const products = await Product.findAll();
  res.render(
    'admin/products',
    {
      products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    }
  );
}
