const express = require('express')
const checkAuth = require('../middleware/check-auth')
const ordersController = require('../controllers/order')
const router = express.Router()
router.get('/', checkAuth, ordersController.orders_get_all);
router.post('/', checkAuth, ordersController.orders_create_order);
router.get('/:orderId', checkAuth, ordersController.orders_get_order_by_id)
router.delete('/:orderId', checkAuth, ordersController.orders_delete_order)

module.exports = router;