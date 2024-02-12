import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import { adminRouter } from './routes/admin.routes';
import { shopRouter } from './routes/shop.routes';
import { getError } from './controllers/error.controller';
import { sequelize } from './utils/database.util';
import { Product } from './models/product.model';
import { User } from './models/user.model';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

export const rootDir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(async (req: any, res, next) => {
  const user = await User.findByPk(1);
  if (user) {
    req.user = user;
  }
  next();
});
app.use('/admin', adminRouter);
app.use('/', shopRouter);
app.use(getError);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log('connected to DB')
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Nick', email: 'email@email' });
    }
    return user;
  })
  .catch((err) => console.error({ err }));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
