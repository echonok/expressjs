import { Router } from 'express';
import {
  deleteProduct,
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProductView,
  postEditProduct
} from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.get('/add-product', getAddProduct);
adminRouter.get('/products', getProducts);
adminRouter.post('/add-product', postAddProductView);
adminRouter.get('/edit-product/:productId', getEditProduct);
adminRouter.post('/edit-product', postEditProduct);
adminRouter.post('/delete-product', deleteProduct);
