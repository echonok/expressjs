import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import { adminRouter } from './routes/admin.routes';
import { shopRouter } from './routes/shop.routes';
import { getError } from './controllers/error.controller';
import { pool } from './utils/database.util';

dotenv.config();

export const DB = pool;

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

export const rootDir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', shopRouter);
app.use(getError);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
