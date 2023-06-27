import path from 'path';
import fs from 'fs';

import { rootDir } from '../app';
import { IProduct } from './product.model';

export interface ICartProduct {
  productId: string;
  qty: number;
}

export class Cart {

  static addProduct(id: string, productPrice: number) {
    console.log({ id, productPrice })
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, fileContent: any) => {
        let cart: { products: ICartProduct[], totalPrice: number } = { products: [], totalPrice: 0 };
        if (!err) {
          cart = JSON.parse(fileContent);
        }
        const existingProductIndex = cart.products.findIndex((product) => product.productId === id);
        console.log({ existingProductIndex });
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct: ICartProduct;
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.qty += 1;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = { productId: id, qty: 1 };
          cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice += productPrice;
        fs.writeFile(filePath, JSON.stringify(cart), (err) => {
          console.error({ err })
        });
      },
    );
  }
}
