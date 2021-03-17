const db = require('../models')
const Order = db.Order

let orderController = {
  getOrders: (req, res) => {
    Order.findAll({ include: 'items' }).then(orders => {
      orders = orders.map(order => ({
        ...order.dataValues
      }))
      console.log('orders', orders)
      return res.render('orders', {
        orders
      })
    })
  },
}

module.exports = orderController
