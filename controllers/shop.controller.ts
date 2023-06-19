import { RequestHandler } from 'express';
import { Product } from '../models/product.model';

export const getProducts: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
    console.log({ products });
    res.render(
      'shop/product-list',
      {
        products,
        pageTitle: 'Main',
        path: '/products',
        hasProducts: !!products.length,
      }
    )
  });
}

export const getIndex: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
    res.render(
      'shop/index',
      {
        products,
        pageTitle: 'Main',
        path: '/',
        hasProducts: !!products.length,
      }
    )
  });
}

export const getCart: RequestHandler = async (req, res) => {
  res.render(
    'shop/cart',
    {
      pageTitle: 'Your cart',
      path: '/cart',
    }
  )
}

export const getOrders: RequestHandler = async (req, res) => {
  res.render(
    'shop/orders',
    {
      pageTitle: 'Your orders',
      path: '/orders',
    }
  )
}

export const getCheckout: RequestHandler = async (req, res) => {
  res.render(
    'shop/checkout',
    {
      pageTitle: 'Checkout',
      path: '/checkout',
    }
  )
}
