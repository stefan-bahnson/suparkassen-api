var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var host = require('vhost');
var credentials = require('./credentials');
var admin = express.Router();

var PrivateOrder = require('./models/privateOrder');
var Product = require('./models/product');
var Payment = require('./models/payment');
var CompanyOrder = require('./models/companyOrder');
var companyOrderRoutes = require('./routes/company.routes');
var privateOrderRoutes = require('./routes/private.routes');

var mongoURI = 'mongodb://admin:admin@ds117189.mlab.com:17189/suparkassen';

mongoose.connect(mongoURI);

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use('/api/company-orders', companyOrderRoutes);
app.use('/api/private-orders', privateOrderRoutes);

app.get('/', (req, res) => {
  res.redirect('/api')
});

app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req, res) => {
  PrivateOrder.find()
    .exec((err, order) => {
      if (err) {
        res.send(err);
      } else {
        res.json(order);
      }
    })
});

app.post('/test', (req, res) => {
  PrivateOrder.create(req.body, (err, order) => {
    if (err) {
      res.send(err)
    } else {
      res.json(order);
    }
  })
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

app.post('/api/payment', (req, res) => {
  Payment.create(req.body, (err, payment) => {
    if (err) {
      res.send(err)
    } else {
      res.json(payment);

      app.use(host('admin.*', admin));

      var mailTransport = nodemailer.createTransport('SMTP',{
        service: 'Gmail',
        auth: {
          user: credentials.gmail.user,
          pass: credentials.gmail.password,
        }
      });

      var orderId = Math.floor((Math.random() * 1000000) + 100000);

      mailTransport.sendMail({
        from: '"suparkassen.se" <kervmejj@gmail.com>',
        to: payment.email,
        subject: 'Orderbekräftelse från suparkassen',
        html: "<h4>Ordernummer: " + orderId + "</h4>" +
        "<h3>Tack " + payment.firstname + " " + payment.lastname + " för din beställning!</h3>" +
        "<h4>Du har handlat för: " + payment.totalprice + "kr</h4>" +
        "<p>Ha en fortsatt trevlig dag önskar vi på Suparkassen!</p>",
        text: ''
      }, function(err){
        if(err) console.error( 'Unable to send email: ' + err );
      }, function () {
        console.log("mail sent to: kervmej");
      });
    }
  })
});

app.get('/api/payment', (req, res) => {
  Payment.find()
    .exec((err, payment) => {
      if (err) {
        res.send(err)
      } else {
        res.json(payment);
      }
    })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});