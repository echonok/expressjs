import { RequestHandler } from 'express';

import { IProduct, ProductModel } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { CustomRequest } from '../middlewares/attach-properties.middleware';

export const getProducts: RequestHandler = async (req: CustomRequest, res) => {
  const products = await ProductModel.find();
  res.render(
    'shop/product-list',
    {
      products,
      pageTitle: 'Main',
      path: '/products',
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const getProduct: RequestHandler = async (req: CustomRequest, res) => {
  const id = <{ _id: string }>req.params;
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
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const getIndex: RequestHandler = async (req: CustomRequest, res) => {
  const products = await ProductModel.find();
  res.render(
    'shop/index',
    {
      products,
      pageTitle: 'Main',
      path: '/',
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const getCart: RequestHandler = async (req: CustomRequest, res) => {
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
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const postCart: RequestHandler = async (req: CustomRequest, res) => {
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

export const createOrder: RequestHandler = async (req: CustomRequest, res) => {
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

export const getOrders: RequestHandler = async (req: CustomRequest, res) => {
  const { userId } = <{ userId: string }>req.headers;
  const orders = await Order.find({ userId });
  res.render(
    'shop/orders',
    {
      orders: orders,
      pageTitle: 'Your orders',
      path: '/orders',
      isAuthenticated: req.isLoggedIn,
    },
  );
};

export const getCheckout: RequestHandler = async (req: CustomRequest, res) => {
  res.render(
    'shop/checkout',
    {
      pageTitle: 'Checkout',
      path: '/checkout',
      isAuthenticated: req.isLoggedIn,
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
