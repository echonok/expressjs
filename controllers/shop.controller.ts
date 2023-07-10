import { RequestHandler } from 'express';

import { IProduct, Product } from '../models/product.model';
import { Cart, ICart } from '../models/cart.model';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await Product.fetchAll();
  console.log({ products })
  res.render(
    'shop/product-list',
    {
      products,
      pageTitle: 'Main',
      path: '/products',
    }
  );
}

export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  console.log('getProduct', { product })
  if (!product) {
    return res.redirect('/');
  }
  res.render('shop/product-detail', { pageTitle: product.title, product, path: '/products' });
}

export const getIndex: RequestHandler = async (req, res) => {
  const products = await Product.fetchAll();
  console.log({ products })
  res.render(
    'shop/index',
    {
      products,
      pageTitle: 'Main',
      path: '/',
    }
  );
}

export const getCart: RequestHandler = async (req, res) => {
  const products = await Product.fetchAll();
  console.log({ products })
  Cart.getCartProducts((cart: ICart) => {
    const productsToShow = cart.products.map((product) => {
      return { product: (<IProduct[]>products).find((p) => p.id === product.productId), qty: product.qty };
    });
    res.render(
      'shop/cart',
      {
        products: productsToShow,
        pageTitle: 'Your cart',
        path: '/cart',
      }
    )
  });
}

export const postCart: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  const product = await Product.findById(productId);
  console.log({ product })
  if (!product) {
    return res.redirect('/');
  }
  Cart.addProduct(product.id, product.price);
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

export const postCartDeleteItem: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  const product = await Product.findById(productId);
  console.log({ product })
  if (!product) {
    return res.redirect('/');
  }
  Cart.deleteProduct(productId, product.price);
  res.redirect('/cart');
}
