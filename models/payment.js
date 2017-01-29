var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    totalprice: {
      type: Number,
      required: true
    }
  }
);

var Payment = module.exports = mongoose.model('Payment', paymentSchema);