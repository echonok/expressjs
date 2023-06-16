import * as fs from 'fs';
import path from 'path';
import { rootDir } from '../app';

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

export class Product {
  title: string;

  constructor(
    title: string,
  ) {
    this.title = title;
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
