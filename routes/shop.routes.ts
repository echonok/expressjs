import { Router } from 'express';
import { getProducts } from '../controllers/products.controller';

export const shopRouter = Router();

shopRouter.get('/', getProducts);
