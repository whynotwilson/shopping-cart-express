const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const sequelize = require('sequelize')
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

let cartController = {
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart.dataValues
      cart.items = cart.items.map(item => ({
        ...item.dataValues
      }))
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart,
        totalPrice
      })
    })
  },

  postCart: async (req, res) => {
    try {
      const cart = await Cart.findOrCreate({ where: { id: req.session.cartId || 0 } })

      const cartItem = await CartItem.findOrCreate({
        where: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId,
        },
        default: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId,
        }
      })

      await CartItem.update({
        CartId: cart[0].dataValues.id,
        ProductId: req.body.productId,
        quantity: (cartItem[0].dataValues.quantity || 0) + 1
      }, {
        where: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId
        }
      })

      req.session.cartId = cart[0].dataValues.id
      return req.session.save(() => {
        return res.redirect('back')
      })
    } catch (error) {
      console.log('error', error)
    }
  },
}

module.exports = cartController
