import { Router } from 'express';
import { getAddProduct, getProducts, postAddProductView } from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.get('/add-product', getAddProduct);
adminRouter.get('/products', getProducts);
adminRouter.post('/add-product', postAddProductView);
