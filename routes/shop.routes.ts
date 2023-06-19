import { Router } from 'express';
import { getCart, getCheckout, getIndex, getOrders, getProducts } from '../controllers/shop.controller';

export const shopRouter = Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/cart', getCart);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);
