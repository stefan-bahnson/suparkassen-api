var express = require('express');
var app = express();
var port = 3000;
var mongoose = require('mongoose');
var jsonParser = require('body-parser').json();

var PrivateOrder = require('./models/privateOrder');
var Product = require('./models/product');
var CompanyOrder = require('./models/companyOrder');
var companyOrderRoutes = require('./routes/company.routes');
var privateOrderRoutes = require('./routes/private.routes');

var mongoURI = 'mongodb://admin:admin@ds117189.mlab.com:17189/suparkassen';

mongoose.connect(mongoURI);

app.use(jsonParser);
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use('/api/company-orders', companyOrderRoutes);
app.use('/api/private-orders', privateOrderRoutes);

app.listen(port, function () {
    console.log('Server running on port', port);
});

app.get('/', (req, res) => {
  res.redirect('/api')
});

app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/products', (req, res) => {
    Product.find()
        .exec((err, products) => {
            if (err) {
                res.send(err)
            } else {
                res.json(products);
            }
        })
});

app.post('/api/products', (req, res) => {
    Product.create(req.body, (err, product) => {
        if (err) {
            res.send(err)
        } else {
            res.json(product);
        }
    })
});

app.get('/api/products/search', (req, res) => {
    let q = req.query.q;
    let pattern = new RegExp(q, "i");
    Product.find({$or:[ { type: { $regex: pattern }}, { name: { $regex: pattern }}]})
        .exec((err, products) => {
            if (err) {
                res.send(err)
            } else {
                res.json(products);
            }
        })
});