import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import * as mongoose from 'mongoose';

import { adminRouter } from './routes/admin.routes';
import { getError } from './controllers/error.controller';
import { shopRouter } from './routes/shop.routes';
import { UserModel } from './models/user.model';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(async (req, _res, next) => {
  const user = await UserModel.findById('65d8f9aa317860dc39e9a7cd');
  if (user) {
    req.headers.userId = user._id.toString();
  }
  next();
});
app.use('/admin', adminRouter);
app.use('/', shopRouter);
app.use(getError);

mongoose
  .connect('mongodb+srv://dev:7J6xZRgDf1ufJkdE@dev.m2tjfcf.mongodb.net/shop?retryWrites=true&w=majority')
  .then((_result) => {
    app.listen(port, async () => {
      console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
      const user = await UserModel.findOne();
      if (!user) {
        const newUser = new UserModel({
          name: 'John',
          email: 'john@example.com',
        });
        await newUser.save();
      }
    });
  })
  .catch((error) => {
    console.error('connection error: ', error);
  });
