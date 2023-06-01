import { Router } from 'express';
import path from 'path';

import { rootDir } from '../app';

export const shopRouter = Router();

shopRouter.get('/', (req, res) => {
  console.log('not found');
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});
