import { RequestHandler } from 'express';

import { IProduct, ProductModel } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { MODELS } from '../models/_models';
import { Order } from '../models/order.model';
// import { Cart } from '../models/cart.model';
// import { User } from '../models/user.model';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await ProductModel.find();
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
  const product = await ProductModel.findById(id);
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
  const products = await ProductModel.find();
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
  const userCart = await Cart
    .findOne({ userId })
    .populate('products.productId');
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
  const { userId } = <{ userId: string }>req.headers;
  const { productId } = (<{ productId: string }>req.body);
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.redirect('/');
  }
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [], totalPrice: 0 });
    await cart.save();
  }
  cart.addToCart(productId, +product.price);
  res.redirect('/cart');
};

export const createOrder: RequestHandler = async (req, res) => {
  const { userId } = <{ userId: string }>req.headers;
  const cart = await Cart.findOne({ userId }).populate('products.productId');
  if (cart) {
    let totalPrice = 0;
    const mappedProducts = cart.products.map((p) => {
      const product = p.productId as unknown as IProduct;
      totalPrice += (p.qty * (p.productId as unknown as IProduct).price);
      return { product: { ...product }, qty: p.qty };
    });
    const newOrder = new Order({
      userId,
      products: mappedProducts,
      totalPrice,
    });
    await newOrder.save();
    cart.clearCart();
  }
  res.redirect('/orders');
};

export const getOrders: RequestHandler = async (req, res) => {
  const { userId } = <{ userId: string }>req.headers;
  const orders = await Order.find({ userId });
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
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.redirect('/');
  }
  const { userId } = <{ userId: string }>req.headers;
  const cart = await Cart.findOne({ userId });
  cart.deleteProduct(productId, product.price);
  res.redirect('/cart');
};
