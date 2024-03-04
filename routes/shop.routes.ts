import { Router } from 'express';
import {
  createOrder,
  getCart,
  getCheckout,
  getIndex,
  getOrders,
  getProduct,
  getProducts,
  postCart,
  postCartDeleteItem,
} from '../controllers/shop.controller';
import { isAuthMiddleware } from '../middlewares/is-auth.middleware';

export const shopRouter = Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products/:_id', getProduct);
shopRouter.get('/products', getProducts);

shopRouter.get('/cart', isAuthMiddleware, getCart);
shopRouter.post('/cart', isAuthMiddleware, postCart);
shopRouter.post('/create-order', isAuthMiddleware, createOrder);
shopRouter.get('/orders', isAuthMiddleware, getOrders);
shopRouter.get('/checkout', isAuthMiddleware, getCheckout);
shopRouter.post('/cart-delete-item', isAuthMiddleware, postCartDeleteItem);
