var express = require('express');
var router = express.Router();
var Products = require('../models/product');
var middleware = require('../middleware/index');

router.get('/products/:category', function(req, res){
    Products.find({category: req.params.category}, function(err, foundProducts){
        if(err){
            res.redirect('/products');
        } else{
            res.render("products/index", {category: req.params.category, products: foundProducts});
        }
    });
});

//New Route
router.get('/products/:category/new', middleware.isAdmin, function(req, res){
    res.render('products/new', {category: req.params.category});
});

//Create Route
router.post('/products/:category', middleware.isAdmin, function(req, res){
    Products.create(req.body.product, function(err, newProduct){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            req.flash('success', 'Added '+ newProduct.name);
            res.redirect('/products/'+req.params.category);
        }
    });
});

//Show Route
router.get('/products/:category/:id', function(req, res){
    Products.findById(req.params.id, function(err, product){
        if(err){
            res.redirect('/products/'+req.params.category);
        } else{
            res.render('products/show', {product: product});
        }
    });
});

//Edit Route
router.get('/products/:category/:id/edit', middleware.isAdmin,function(req, res){
    Products.findById(req.params.id, function(err, product){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            res.render('products/edit', {product: product});
        }
    });
});

//Update Route
router.put('/products/:category/:id', middleware.isAdmin, function(req, res){
    Products.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            req.flash('success', 'Successfully Updated!');
            res.redirect('/products/'+req.params.category+"/"+req.params.id);
        }
    });
});

//Delete Route
router.delete('/products/:category/:id', middleware.isAdmin, function(req, res){
    Products.findByIdAndDelete(req.params.id, function(err){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else{
            req.flash('success', 'Successfully Deleted');
            res.redirect('/products/'+req.params.category);
        }
    });
});

module.exports = router;