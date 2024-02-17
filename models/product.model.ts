import { ObjectId } from 'mongodb';

import { getDb } from '../utils/database.util';
import { MODELS } from './_models';

export interface IProduct {
  _id?: ObjectId;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  userId: ObjectId;
}

export class Product {
  constructor(
    private product: IProduct,
    private userId: string,
  ) {
  }

  save() {
    const db = getDb();
    const dataToSave = {
      ...this.product,
      userId: this.userId ? new ObjectId(this.userId) : null,
      price: +this.product.price,
    };
    if (this.product._id) {
      const { _id, ...update } = dataToSave;
      return db.collection(MODELS.products).updateOne({ _id: new ObjectId(_id) }, { $set: update });
    } else {
      return db.collection(MODELS.products).insertOne(dataToSave);
    }
  }

  static async fetchById(productId: string) {
    const db = getDb();
    try {
      return await db
        .collection(MODELS.products)
        .findOne(new ObjectId(productId));
    } catch (err) {
      console.error({ err });
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      const products = await db
        .collection(MODELS.products)
        .find()
        .toArray();
      return products as IProduct[];
    } catch (err) {
      console.error({ err });
    }
  }

  static async deleteById(productId: string) {
    const db = getDb();
    try {
      return await db
        .collection(MODELS.products)
        .deleteOne({ _id: new ObjectId(productId) });
    } catch (err) {
      console.error({ err });
    }
  }
}
