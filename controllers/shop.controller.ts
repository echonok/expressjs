import { RequestHandler } from 'express';

import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await Product.fetchAll();
  res.render(
    'shop/product-list',
    {
      products,
      pageTitle: 'Main',
      path: '/products',
    },
  );
};

export const getProduct: RequestHandler<{ _id: string }> = async (req, res) => {
  const id = req.params._id;
  const product = await Product.fetchById(id);
  if (!product) {
    return res.redirect('/');
  }
  res.render(
    'shop/product-detail',
    {
      pageTitle: product.title,
      product,
      path: '/products',
    },
  );
};

export const getIndex: RequestHandler = async (req, res) => {
  const products = await Product.fetchAll();
  res.render(
    'shop/index',
    {
      products,
      pageTitle: 'Main',
      path: '/',
    },
  );
};

export const getCart: RequestHandler = async (req, res) => {
  const { userId } = <{ userId: string }>req.headers;
  const userCart = await Cart.getUserCartWithProducts(userId);
  res.render(
    'shop/cart',
    {
      products: userCart.products,
      pageTitle: 'Your cart',
      path: '/cart',
    },
  );
};

export const postCart: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  const product = await Product.fetchById(productId);
  if (!product) {
    return res.redirect('/');
  }
  const { userId } = <{ userId: string }>req.headers;
  await Cart.addProduct(productId, +product.price, userId);
  res.redirect('/cart');
};

export const createOrder: RequestHandler = async (req, res) => {
  const { userId } = <{ userId: string }>req.headers;
  await User.addOrder(userId);
  res.redirect('/orders');
};

export const getOrders: RequestHandler = async (req, res) => {
  const { userId } = <{ userId: string }>req.headers;
  const orders = await User.getOrders(userId);

  res.render(
    'shop/orders',
    {
      orders: orders,
      pageTitle: 'Your orders',
      path: '/orders',
    },
  );
};

export const getCheckout: RequestHandler = async (req, res) => {
  res.render(
    'shop/checkout',
    {
      pageTitle: 'Checkout',
      path: '/checkout',
    },
  );
};

export const postCartDeleteItem: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  const product = await Product.fetchById(productId);
  if (!product) {
    return res.redirect('/');
  }
  const { userId } = <{ userId: string }>req.headers;
  await Cart.deleteProduct(productId, product.price, userId);
  res.redirect('/cart');
};
