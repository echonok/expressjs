import { Document, Model, model, Schema } from 'mongoose';

import { MODELS } from './_models';

export interface ICartProduct {
  productId: string;
  qty: number;
}

export interface ICart {
  userId: Schema.Types.ObjectId;
  products: ICartProduct[];
  totalPrice: number;
}

interface ICartMethods {
  addToCart(productId: string, productPrice: number): void;
  deleteProduct(productId: string, productPrice: number): void;
  clearCart(): void;
}

export type CartModel = Model<ICart, {}, ICartMethods>;

const CartSchema = new Schema<ICart, CartModel, ICartMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODELS.users,
    required: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: MODELS.products,
      required: false,
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

CartSchema.method('addToCart', function(productId: string, productPrice: number) {
  const existingProductIndex = this.products.findIndex((product) => product.productId.toString() === productId);
  let updatedProduct: ICartProduct;
  if (existingProductIndex < 0) {
    updatedProduct = { productId: productId, qty: 1 };
    this.products = [...this.products, updatedProduct];
  } else {
    this.products[existingProductIndex].qty += 1;
  }
  this.totalPrice += +productPrice;
  return this.save();
});

CartSchema.method('deleteProduct', function(productId: string, productPrice: number) {
  const product = this.products.find((product) => product.productId.toString() === productId);
  if (product) {
    const productQty = product.qty;
    this.products = this.products.filter((product) => product.productId.toString() !== productId);
    this.totalPrice = this.totalPrice - productPrice * productQty;
  }
  return this.save();
});

CartSchema.method('clearCart', function() {
  this.products = [];
  this.totalPrice = 0;
  return this.save();
});

export const Cart = model<ICart, CartModel>(MODELS.carts, CartSchema);
