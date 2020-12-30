var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middlewareObj.isAdmin = function(req, res, next){
    if(req.user && req.user.role === 'admin'){
       return next();
    }
    res.redirect('back');
}

module.exports = middlewareObj;