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

export const shopRouter = Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products/:_id', getProduct);
shopRouter.get('/products', getProducts);
shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postCart);
shopRouter.post('/create-order', createOrder);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);
shopRouter.post('/cart-delete-item', postCartDeleteItem);
