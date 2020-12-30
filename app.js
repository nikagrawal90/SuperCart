var express                 = require('express'),
    mongoose                = require('mongoose'),
    bodyParser              = require('body-parser'),
    flash                   = require('connect-flash'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    methodOverride          = require('method-override'),
    Products                = require('./models/product'),
    Cart                    = require('./models/cart'),
    middleware              = require('./middleware/index'),
    User                    = require('./models/user');

var app = express();
app.set('view engine', 'ejs');

//require routes
var indexRoutes     = require('./routes/index'),
    cartRoutes      = require('./routes/cart'),
    productRoutes   = require('./routes/products'),
    profileRoutes   = require('./routes/profile');

mongoose.connect("mongodb+srv://nikhil:nikhil@cluster0.uvd3b.mongodb.net/<dbname>?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport configuration
app.use(require('express-session')({
    secret: "SuperCart is the Best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use(cartRoutes);
app.use(productRoutes);
app.use(profileRoutes);

app.listen(process.env.PORT, process.env.Id, function(){
    console.log("Server is running!!");
});