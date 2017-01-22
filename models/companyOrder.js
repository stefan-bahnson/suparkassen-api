var mongoose = require('mongoose');

var companyOrderSchema = mongoose.Schema({

    companyname: {
        type: String,
        required: true
    },
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
    orgnr: {
        type: Number,
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

var CompanyOrder = module.exports = mongoose.model('companyOrder', companyOrderSchema);