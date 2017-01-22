var mongoose = require('mongoose');

var privateOrderSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true
    },
    items: [{
        type: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        alcohol: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        img: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});



var PrivateOrder = module.exports = mongoose.model('privateOrder', privateOrderSchema);