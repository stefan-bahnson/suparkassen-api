var express = require('express');
var app = express();
var port = 3000;
var mongoose = require('mongoose');
var jsonParser = require('body-parser').json();
var Product = require('./models/product');
var Payment = require('./models/payment');
var nodemailer = require('nodemailer');
var vhost = require('vhost');
var admin = express.Router();
var credentials = require('./credentials');

mongoose.connect('mongodb://admin:admin@ds117189.mlab.com:17189/suparkassen');

app.use(jsonParser);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});
app.use(vhost('admin.*', admin));

app.listen(port, function () {
  console.log('Server running on port', port);
});

app.get('/', (req, res) => {
  res.send('hello');
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

var orderId = Math.floor((Math.random() * 1000000) + 100000);
var imgPath = "./assets/suparkassen_logo.png";

app.post('/api/payment', (req, res) => {
  console.log(req.body);
  Payment.create(req.body, (err, payment) => {
    if (err) {
      res.send(err)
    } else {
      res.json(payment);

      //mail skicka obj //payment.name bla till mailet payment.totalprice
      //Res???
      //"STATUS KOD" RES.SEND "201"=CREATED

      var mailTransport = nodemailer.createTransport('SMTP',{
        service: 'Gmail',
        auth: {
          user: credentials.gmail.user,
          pass: credentials.gmail.password,
        }
      });
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