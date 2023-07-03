import { RequestHandler } from 'express';

import { IProduct, Product } from '../models/product.model';
import { Cart, ICart } from '../models/cart.model';

export const getProducts: RequestHandler = async (req, res) => {
  Product.fetchAll((products: any) => {
    res.render(
      'shop/product-list',
      {
        products,
        pageTitle: 'Main',
        path: '/products',
      }
    )
  });
}

export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
  const id = req.params.id;
  Product.findById(id, (product: IProduct) => {
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
      }
    )
  });
}

export const getCart: RequestHandler = async (req, res) => {
  Product.fetchAll((products: IProduct[]) => {
    Cart.getCartProducts((cart: ICart) => {
      const productsToShow = cart.products.map((product) => {
        return { product: products.find((p) => p.id === product.productId), qty: product.qty };
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
  });
}

export const postCart: RequestHandler = async (req, res) => {
  const { productId } = (<{ productId: string }>req.body);
  Product.findById(productId, (product: IProduct) => {
    Cart.addProduct(product.id, product.price);
  });
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
  Product.findById(productId, (product: IProduct) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
}
