import path from 'path';
import fs from 'fs';

import { rootDir } from '../app';

export interface ICartProduct {
  productId: string;
  qty: number;
}

interface ICart {
  products: ICartProduct[];
  totalPrice: number;
}

export class Cart {

  static addProduct(id: string, productPrice: number) {
    console.log({ id, productPrice })
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, fileContent: any) => {
        let cart: ICart = { products: [], totalPrice: 0 };
        if (!err) {
          console.log('before');
          console.log({ fileContent })
          cart = JSON.parse(fileContent);
          console.log({ cart })
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

  static deleteProduct(id: string, price: number) {
    const filePath = path.join(rootDir, 'data', 'cart.json') ?? '';
    fs.readFile(
      filePath,
      (err: any, cart: any) => {
        console.log({ cart })
        if (err) {
          return;
        }
        const updatedCart = <ICart>JSON.parse(cart);
        console.log({ 'updatedCart': updatedCart })
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
}
