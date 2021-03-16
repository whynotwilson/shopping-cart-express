const { company } = require('faker');
const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3;
const PAGE_OFFSET = 0;

let productController = {
  getProducts: (req, res) => {
    Product.findAndCountAll({ offset: PAGE_OFFSET, limit: PAGE_LIMIT }).then(products => {
      products = products.rows.map(product => ({
        ...product.dataValues
      }))
      return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
        if (cart) {
          cart = cart.dataValues
          cart.items = cart.items.map(item => ({
            ...item.dataValues
          }))
        }
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        return res.render('products', {
          products,
          cart,
          totalPrice,
        })
      })
    })
  },
}

module.exports = productController
