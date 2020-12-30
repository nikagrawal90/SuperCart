var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    category: String,
    description: String,
    available: Number
});

module.exports = mongoose.model("Product", productSchema);