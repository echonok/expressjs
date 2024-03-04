import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import * as mongoose from 'mongoose';

import { adminRouter } from './routes/admin.routes';
import { getError } from './controllers/error.controller';
import { shopRouter } from './routes/shop.routes';
import { UserModel } from './models/user.model';
import { authRouter } from './routes/auth.routes';
import { attachProperties } from './middlewares/attach-properties.middleware';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

dotenv.config();

const MONGO_DB_URI = 'mongodb+srv://dev:7J6xZRgDf1ufJkdE@dev.m2tjfcf.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const port = process.env.PORT;
const MongoStore = MongoDBStore(session);
const store = new MongoStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});

app.use(session({ secret: 'my_secret', resave: false, saveUninitialized: false, store }));
app.use(cookieParser());
app.use(attachProperties);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRouter);
app.use('/', shopRouter);
app.use('/', authRouter);
app.use(getError);

mongoose
  .connect(MONGO_DB_URI)
  .then((_result) => app.listen(port))
  .catch((error) => console.error('connection error: ', error));
