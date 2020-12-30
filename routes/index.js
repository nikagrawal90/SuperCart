var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

//Root Route
router.get('/', function(req, res){
    res.render("home");
});

//Index Route
router.get('/products', function(req, res){
    res.redirect('/products/fashion');
});

// ===============================================
//  User Routes
// ===============================================

//Register Route
router.get("/register", function(req, res){
    res.render('register');
});

// Handle SignUp Logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            res.redirect('/register');
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect('/products');
            });
        }
    });
});

//login Route
router.get('/login', function(req, res){
    res.render('login');
});

//login logic
router.post('/login',passport.authenticate('local', 
    {
        successRedirect: "/products",
        failureRedirect: '/login'
    }), function(req, res){
});

//logout Route
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged Out!')
    res.redirect('/');
});

module.exports = router;