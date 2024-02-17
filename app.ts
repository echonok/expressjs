import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import { adminRouter } from './routes/admin.routes';
import { getError } from './controllers/error.controller';
import { MongoConnect } from './utils/database.util';
import { shopRouter } from './routes/shop.routes';
import { User } from './models/user.model';

dotenv.config();

const mongoConnect = MongoConnect;

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

export const rootDir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(async (req, _res, next) => {
  const user = await User.findById('65cd2aaa864ea202d8d05275');
  console.log({ user });
  if (user) {
    req.headers.userId = user._id.toString();
  }
  next();
});
app.use('/admin', adminRouter);
app.use('/', shopRouter);
app.use(getError);

mongoConnect((_err, _client) => {
  app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    const users = await User.fetchAll();
    if (!users.length) {
      const user = new User({
        name: 'John',
        email: 'john@example.com',
      });
      await user.save();
    }
  });
});
