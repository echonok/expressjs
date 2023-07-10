import * as fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { DB, rootDir } from '../app';
import { Cart } from './cart.model';

export interface IProduct {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

const getProductsFromFile = (cb: any) => {
  const filePath = path.join(rootDir, 'data', 'products.json') ?? '';
  fs.readFile(
    filePath,
    (err: any, fileContent: any) => {
      if (err) {
        return cb([]);
      }
      const products = fileContent.toString();
      cb(products === '' ? [] : JSON.parse(products));
    },
  );
}

export class Product implements IProduct {
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  id: string;

  constructor(
    product: IProduct,
  ) {
    this.id = product.id;
    this.title = product.title;
    this.imageUrl = product.imageUrl;
    this.description = product.description;
    this.price = +product.price;
  }

  async save() {
    await DB.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)',
      [this.title, this.price, this.imageUrl,  this.description]
    );
  }

  static async fetchAll() {
    const [products] = await DB.execute('SELECT * FROM products')
    return (<IProduct[]>products);
  }

  static async findById(id: string) {
    const [productsFound] = await DB.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    if (!(<IProduct[]>productsFound).length) {
      return null;
    }
    return (<IProduct[]>productsFound).pop();
  }

  static deleteById(id: string) {
    getProductsFromFile((products: IProduct[]) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        return;
      }
      const filePath = path.join(rootDir, 'data', 'products.json') ?? '';
      let updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Cart.deleteProduct(id, product.price);
      })
    })
  }
}
