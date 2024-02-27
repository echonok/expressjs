import { Model, model, Schema } from 'mongoose';

import { MODELS } from './_models';

export interface IOrderProduct {
  product: Object;
  qty: number;
}

export interface IOrder {
  userId: Schema.Types.ObjectId;
  products: IOrderProduct[];
  totalPrice: number;
}

interface IOrderMethods {
  addToCart(productId: string, productPrice: number): void;

  deleteProduct(productId: string, productPrice: number): void;
}

export type CartModel = Model<IOrder, {}, IOrderMethods>;

const OrderSchema = new Schema<IOrder, CartModel, IOrderMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODELS.users,
    required: true,
  },
  products: [{
    product: {
      type: Object,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
});

export const Order = model<IOrder, CartModel>(MODELS.orders, OrderSchema);
