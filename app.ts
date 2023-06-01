import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import { adminRouter } from './routes/admin.routes';
import { shopRouter } from './routes/shop.routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

export const rootDir  = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res) => {
  res.sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
