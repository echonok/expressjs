import { RequestHandler } from 'express';
import { IProduct, Product } from '../models/product.model';
import { Cart } from '../models/cart.model';

export const getProducts: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
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

export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
  console.log('req.params', req.params)
  const id = req.params.id;
  console.log({ id });
  Product.findById(id, (product: IProduct) => {
    console.log({ product })
    res.render('shop/product-detail', { pageTitle: product.title, product, path: '/products' });
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

export const postCart: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  Product.findById(productId, (product: IProduct) => {
    Cart.addProduct(product.id, product.price);
  });
  console.log({ productId });
  res.redirect('/cart');
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
