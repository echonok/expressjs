import { model, Schema } from 'mongoose';
import { MODELS } from './_models';

export interface IProduct {
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  userId: Schema.Types.ObjectId;
}

export interface IProductWithId extends IProduct {
  _id: string;
}

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODELS.users,
    required: false,
  },
});

export const ProductModel = model<IProduct>(MODELS.products, productSchema)
