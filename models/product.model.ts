import * as fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { rootDir } from '../app';
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

  save() {
    const filePath = path.join(rootDir, 'data', 'products.json') ?? '';
    getProductsFromFile((products: IProduct[]) => {
      let productToSave = [...products];
      console.log('this.id', this.id)
      if (this.id) {
        const foundProductIndex = productToSave.findIndex((product) => product.id === this.id);
        productToSave[foundProductIndex] = this;
      } else {
        this.id = uuidv4();
        productToSave.push(this);
      }
      fs.writeFile(filePath, JSON.stringify(productToSave), (err) => {
        if (err) {
          console.error(err);
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
