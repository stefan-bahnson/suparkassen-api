var express = require('express');
var privateOrderRoutes = express.Router();
var PrivateOrder = require('../models/privateOrder');


privateOrderRoutes.get('/', (req, res) => {
    PrivateOrder.find()
        .exec((err, orders) => {
            if (err) {
                res.send(err)
            } else {
                res.json(orders);
            }
        })
});

privateOrderRoutes.post('/', (req, res) => {
    PrivateOrder.create(req.body, (err, order) => {
        if (err) {
            res.send(err)
        } else {
            res.json(order);
        }
    })
});

module.exports = privateOrderRoutes;