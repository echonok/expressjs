import * as fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { rootDir } from '../app';

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
  id!: string;

  constructor(
    product: IProduct,
  ) {
    this.title = product.title;
    this.imageUrl = product.imageUrl;
    this.description = product.description;
    this.price = +product.price;
  }

  save() {
    const filePath = path.join(rootDir, 'data', 'products.json') ?? '';
    this.id = uuidv4();
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

  static findById(id: string, cb: any) {
    getProductsFromFile((products: IProduct[]) => {
      const foundProduct = products.find((product) => product.id === id);
      cb(foundProduct);
    });
  }
}
