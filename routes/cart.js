var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index');
var User = require('../models/user');
var Cart = require('../models/cart');
var Products = require('../models/product');

// ======================================
// Cart Routes
// ======================================

//Cart Routes
router.get('/cart', middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate('cart').exec(function(err, foundUser){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            Cart.find({user_id: foundUser._id}, function(err, foundCartItems){
                if(err){
                    req.flash('error', err.message);
                    res.redirect('back');
                } else{
                    res.render('cart', {user: foundUser, cartItems: foundCartItems});
                }
            });
        }
    });
});

// Increase or decrease the quantity
router.get('/cart/:product_id', middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            Products.findById(req.params.product_id, function(err, product){
                if(err){
                    req.flash('error', err.message);
                    res.redirect('back');
                } else{
                    Cart.findOne({product_id: product._id, user_id: user._id}, function(err, foundCartItem){
                        if(err){
                            req.flash('error', err.message);
                            res.redirect('back');
                        } else{
                            // if the quantity of product falls to zero remove it
                            if(foundCartItem.quantity + parseInt(req.query.alter) > 0){
                                foundCartItem.quantity += parseInt(req.query.alter);
                                foundCartItem.save();
                            } else{
                                // if the quantity of product falls to zero remove it
                                Cart.findByIdAndDelete(foundCartItem._id, function(err){
                                    if(err){
                                        res.redirect('back');
                                    }
                                });
                                // Also remove it from user.cart
                                for(var i=0; i< user.cart.length; i++){
                                    if(user.cart[i].equals(product._id)){
                                        user.cart.splice(i, 1);
                                        user.save();
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    res.redirect('/cart');
                }
            });
        }
    });
});

//Add to Cart
router.get('/products/:category/:id/cart', middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            Products.findById(req.params.id, function(err, product){
                if(err){
                    req.flash('error', err.message);
                    res.redirect('back');
                } else{
                    Cart.findOne({product_id: product._id, user_id: user._id}, function(err, foundCartItem){
                        if(!foundCartItem){
                            Cart.create({
                                product_id: product._id,
                                user_id: user._id,
                            }, function(err, newCartItem){
                                if(err){
                                    res.redirect('/products');
                                } else{
                                }
                            });
                            user.cart.push(product);
                            user.save();
                        } else{
                            foundCartItem.quantity += 1;
                            foundCartItem.save();
                        }
                    });
                    req.flash('success', 'Added to Cart');
                    res.redirect('/products/'+req.params.category+'/'+req.params.id);
                }
            });
        }
    });
});

module.exports = router;