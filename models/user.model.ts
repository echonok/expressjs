import { ObjectId } from 'mongodb';

import { getDb } from '../utils/database.util';
import { MODELS } from './_models';
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

  addToCart(product: Product) {

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
}
