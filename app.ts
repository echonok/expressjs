import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';

import { adminRouter } from './routes/admin.routes';
import { shopRouter } from './routes/shop.routes';
import { engine } from 'express-handlebars';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.engine('hbs', engine({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main-layout',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

export const rootDir  = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', shopRouter);

app.use((req, res) => {
  res.render('404', { pageTitle: 'Page not found' })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
