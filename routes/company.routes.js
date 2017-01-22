var express = require('express');
var companyOrderRoutes = express.Router();
var CompanyOrder = require('../models/companyOrder');


companyOrderRoutes.get('/', (req, res) => {
    CompanyOrder.find()
        .exec((err, orders) => {
            if (err) {
                res.send(err)
            } else {
                res.json(orders);
            }
        })
});

companyOrderRoutes.post('/', (req, res) => {
    CompanyOrder.create(req.body, (err, order) => {
        if (err) {
            res.send(err)
        } else {
            res.json(order);
        }
    })
});

module.exports = companyOrderRoutes;