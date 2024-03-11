import { Router } from 'express';
import {
  deleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProductView,
  postEditProduct,
} from '../controllers/admin.controller';
import { isAuthMiddleware } from '../middlewares/is-auth.middleware';
import { body, check } from 'express-validator';

export const adminRouter = Router();

adminRouter.get('/products', isAuthMiddleware, getProducts);
adminRouter.get('/add-product', isAuthMiddleware, getAddProduct);
adminRouter.post(
  '/add-product',
  [
    isAuthMiddleware,
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl')
      .isURL(),
    body('price')
      .isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  postAddProductView,
);
adminRouter.get('/edit-product/:productId', isAuthMiddleware, getEditProduct);
adminRouter.post(
  '/edit-product',
  [
    isAuthMiddleware,
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl')
      .isURL(),
    body('price')
      .isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  postEditProduct);
adminRouter.post('/delete-product', isAuthMiddleware, deleteProduct);
