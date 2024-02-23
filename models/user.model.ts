import { ObjectId } from 'mongodb';

import { getDb } from '../utils/database.util';
import { MODELS } from './_models';
import { ICart } from './cart.model';
import { Product } from './product.model';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
}

export class User {
  constructor(
    private user: IUser,
  ) {
  }

  save() {
    const db = getDb();
    if (this.user._id) {
      const { _id, ...update } = this.user;
      return db.collection(MODELS.users).updateOne({ _id: new ObjectId(_id) }, { $set: update });
    } else {
      return db.collection(MODELS.users).insertOne(this.user);
    }
  }

  static async findById(userId: string) {
    const db = getDb();
    try {
      return await db
        .collection(MODELS.users)
        .findOne(new ObjectId(userId));
    } catch (err) {
      console.error({ err });
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db
        .collection(MODELS.users)
        .find()
        .toArray();
    } catch (err) {
      console.error({ err });
    }
  }

  static async addOrder(userId: string) {
    const db = getDb();
    let userCart = await db
      .collection(MODELS.carts)
      .findOne({ userId: new ObjectId(userId) });
    if (!userCart) {
      return;
    }
    const userCartWithPrice = await Promise.all((userCart as ICart).products.map(async (p) => {
      const product = await Product.fetchById(p.productId);
      return { ...p, price: product.price };
    }));
    await db.collection(MODELS.orders).insertOne({ userId: new ObjectId(userId), products: userCartWithPrice });
    await db
      .collection(MODELS.carts)
      .findOneAndUpdate({ userId: new ObjectId(userId) }, { $set: { products: [], totalPrice: 0 } });
  }

  static async getOrders(userId: string) {
    const db = getDb();
    const orders = await db
      .collection(MODELS.orders)
      .find({ userId: new ObjectId(userId) })
      .toArray();
    return orders;
  }
}
