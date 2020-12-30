const cart = require('../models/cart');

var express         = require('express'),
    router          = express.Router(),
    middleware      = require('../middleware/index'),
    User            = require('../models/user'),
    Cart            = require('../models/cart');

router.get('/profile', middleware.isLoggedIn, function(req, res){
    res.render('profile/profile');
});

//Edit Route
router.get('/profile/edit', middleware.isLoggedIn, function(req, res){
    res.render('profile/edit');
});

//Update Route
router.put('/profile', function(req, res){
    User.findByIdAndUpdate(req.user._id, req.body.user, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('/profile');
        } else{
            req.flash('success', 'Profile Updated');
            res.redirect('/profile');
        }
    });
});

//Delete Route
router.delete('/profile', function(req, res){
    Cart.deleteMany({user_id: req.user._id}, function(err){
        if(err){
            res.redirect('back');
        }
    });
    User.findByIdAndDelete(req.user._id, function(err){
        if(err){
            res.redirect('back');
        } else{
            req.flash('success', 'Profile Deleted');
            res.redirect('/products');
        }
    });
});

module.exports = router;