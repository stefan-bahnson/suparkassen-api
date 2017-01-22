var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
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
    }
});

var Product = module.exports = mongoose.model('Product', productSchema);