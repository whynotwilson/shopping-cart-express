const db = require('../models')
const Product = db.Product
const PAGE_LIMIT = 3;
const PAGE_OFFSET = 0;

let productController = {
  getProducts: (req, res) => {
    Product.findAndCountAll({ offset: PAGE_OFFSET, limit: PAGE_LIMIT }).then(products => {
      products = products.rows.map(product => ({
        ...product.dataValues
      }))
      return res.render('products', {
        products
      })
    })
  },
}

module.exports = productController
