import { Router } from 'express';
import {
  deleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProductView,
  postEditProduct
} from '../controllers/admin.controller';
import { isAuthMiddleware } from '../middlewares/is-auth.middleware';

export const adminRouter = Router();

adminRouter.get('/products', isAuthMiddleware, getProducts);
adminRouter.get('/add-product', isAuthMiddleware, getAddProduct);
adminRouter.post('/add-product', isAuthMiddleware, postAddProductView);
adminRouter.get('/edit-product/:productId', isAuthMiddleware, getEditProduct);
adminRouter.post('/edit-product', isAuthMiddleware, postEditProduct);
adminRouter.post('/delete-product', isAuthMiddleware, deleteProduct);
