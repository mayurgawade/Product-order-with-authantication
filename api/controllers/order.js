const Order = require('../models/order')
const Product = require('../models/products')
const mongoose = require('mongoose')

// ORDER : to get all the orders - getAPI
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('quantity _id productId')
    .populate('productId', 'name price')
    .exec()
    .then(
        result => {
            res.status(200).json({
                count: result.length,
                OrderDatails: result.map( doc => {
                    return {
                        _id: doc._id,
                        quantity: doc.quantity,
                        productId: doc.productId,
                        request: {
                            method: 'GET',
                            url: 'http://localhost:3000/orders/' +doc._id
                        }
                    }
                }) 
                
            })
        }
    )
    .catch(
        error => {
            res.status(500).json({
                error: error
            })
        }
    )
}

// ORDER : to create the order - postAPI
exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(
        product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
        const order = new Order({
            _id : new mongoose.Types.ObjectId(),
            productId : req.body.productId,
            quantity : req.body.quantity
        })
        return order.save()
        .then(
            result => {
                res.status(200).json({
                    message: 'Order Created',
                    createdOrder: {
                        _id: result._id,
                        productId: result.productId,
                        quantity: result.quantity,
                    request: {
                        method: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
                })
            }
        )
        .catch( error => {
            res.status(500).json({
                error: error
            })
        })
        })
}

// ORDER : to get order by Id - getAPI
exports.orders_get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(
        order => {
            if(!order) {
                return res.status(404).json({
                    message:"No order found"
                })
            }
            res.status(200).json({
                OrderDetails: order,
                request: {
                    method: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        }
    )
    .catch(
        err => {
            res.status(500).json({
                error: err
            })
        }
    )
}

// ORDER : to delete perticular order - deleteAPI
exports.orders_delete_order = (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(
        order => {
            res.status(200).json({
                message: "your order is deleted successfully",
                request: {
                    type: 'POST',
                    description: 'you can place your order here',
                    url: 'http://localhost:3000/orders/',
                    body: { productId: 'ID', quantity: "number" }
                }
            })
        }
    )
    .catch(
        err => {
            res.status(500).json({
                error: err
            })
        }
    )
}