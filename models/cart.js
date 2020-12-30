var mongoose = require('mongoose');

var cartSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Cart', cartSchema);