import path from 'path';
import fs from 'fs';

import { rootDir } from '../app';
import { ObjectId } from 'mongodb';
import { getDb } from '../utils/database.util';
import { MODELS } from './_models';
import { IProduct } from './product.model';

export interface ICartProduct {
  productId: string;
  qty: number;
  product?: IProduct;
}

export interface ICart {
  _id?: ObjectId;
  userId: ObjectId;
  products: ICartProduct[];
  totalPrice: number;
}

export class Cart {

  static async addProduct(productId: string, productPrice: number, userId: string) {
    const db = getDb();
    const userCart = await this.getUserCart(userId);
    if (!userCart) {
      return;
    }
    const existingProductIndex = userCart.products.findIndex((product) => product.productId === productId);
    const existingProduct = userCart.products[existingProductIndex];
    let updatedProduct: ICartProduct;
    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty += 1;
      userCart.products = [...userCart.products];
      userCart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { productId: productId, qty: 1 };
      userCart.products = [...userCart.products, updatedProduct];
    }
    userCart.totalPrice += +productPrice;
    await db.collection(MODELS.carts).updateOne(
      { userId: new ObjectId(userId) },
      { $set: userCart },
      { upsert: true },
    );
  }

  static async getUserCart(userId: string) {
    const db = getDb();
    let userCart = await db
      .collection(MODELS.carts)
      .findOne({ userId: new ObjectId(userId) });
    if (!userCart) {
      const newCart: ICart = {
        userId: new ObjectId(userId),
        products: [],
        totalPrice: 0,
      };
      const result = await db.collection(MODELS.carts).insertOne(newCart);
      userCart = await db
        .collection(MODELS.carts)
        .findOne(result.insertedId);
    }
    return userCart as ICart;
  }

  static async getUserCartWithProducts(userId: string) {
    const userCart = await this.getUserCart(userId);
    const productIds = userCart.products.map((product) => product.productId);
    const db = getDb();
    const products = await db
      .collection(MODELS.products)
      .find({ _id: { $in: productIds.map((id) => new ObjectId(id)) } })
      .toArray();
    const cartProducts = userCart.products.map((product) => {
      const cartProduct = (products as IProduct[]).find((p) => p._id.toString() === product.productId);
      return {
        ...product,
        product: cartProduct,
      };
    });
    userCart.products = cartProducts;
    return userCart;
  }

  static async deleteProduct(productId: string, productPrice: number, userId: string) {
    const userCart = await this.getUserCart(userId);
    if (!userCart) {
      return;
    }
    const db = getDb();
    const product = userCart.products.find((product) => product.productId === productId);
    if (product) {
      const productQty = product.qty;
      userCart.products = userCart.products.filter((product) => product.productId !== productId);
      userCart.totalPrice = userCart.totalPrice - productPrice * productQty;
      await db.collection(MODELS.carts).updateOne(
        { userId: new ObjectId(userId) },
        { $set: userCart },
        { upsert: true },
      );
    }

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
      },
    );
  }
}
