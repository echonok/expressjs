import { Router } from 'express';
import { getAddProduct, postAddProductView } from '../controllers/products.controller';

export const adminRouter = Router();

adminRouter.get('/add-product', getAddProduct);
adminRouter.post('/add-product', postAddProductView);
