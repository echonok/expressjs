import path from 'path';
import fs from 'fs';

import { rootDir } from '../app';

export interface ICartProduct {
  productId: string;
  qty: number;
}

export interface ICart {
  products: ICartProduct[];
  totalPrice: number;
}

export class Cart {

  static addProduct(id: string, productPrice: number) {
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, fileContent: any) => {
        let cart: ICart = { products: [], totalPrice: 0 };
        if (!err) {
          cart = JSON.parse(fileContent);
        }
        const existingProductIndex = cart.products.findIndex((product) => product.productId === id);
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

  static deleteProduct(id: string, price: number) {
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, cart: any) => {
        if (err) {
          return;
        }
        const updatedCart = <ICart>JSON.parse(cart);
        const product = updatedCart.products.find((product) => product.productId === id);
        if (product) {
          const productQty = product.qty;
          updatedCart.products = updatedCart.products.filter((product) => product.productId !== id);
          updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;
          fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
            console.error({ err })
          });
        }
      }
    );
  }

  static getCartProducts(cb: any) {
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, cart: any) => {
        if (err) {
          cb(null);
        } else {
          cb(JSON.parse(cart));
        }
      }
    )
  }
}
