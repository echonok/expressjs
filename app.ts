import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
  console.log('middleware 1')
  next();
});

app.use((req, res, next) => {
  console.log('middleware 2')
  res.send('<h1>123</h1>');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
