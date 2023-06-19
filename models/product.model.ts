import * as fs from 'fs';
import path from 'path';
import { rootDir } from '../app';

export interface IProduct {
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

  constructor(
    product: IProduct,
  ) {
    this.title = product.title;
    this.imageUrl = product.imageUrl;
    this.description = product.description;
    this.price = product.price;
  }

  save() {
    const filePath = path.join(rootDir, 'data', 'products.json') ?? '';
    getProductsFromFile((products: any[]) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  }

  static fetchAll(cb: any) {
    getProductsFromFile(cb);
  }
}
