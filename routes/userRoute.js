const express = require("express");
const user_route = express();
const session = require("express-session");
const nocache = require("nocache");

const config = require("../config/config");
const errorhandler = require("../middleware/errorHandler")

user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// user_route.use(function(req, res, next) {
//   if (!req.user)
//       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//   next();
// });

const auth = require("../middleware/auth");
// const adminAuth = require('../middleware/adminAuth')

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

// const bodyParser = require("body-parser");
// user_route.use(express.json());
// user_route.use(express.urlencoded({ extended: true }));
// user_route.use(nocache());

const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController')
const offerController = require('../controllers/offerController')
const orderController=require('../controllers/orderController');
const errorHandler = require("../middleware/errorHandler");


user_route.get("/", auth.isLogout, userController.loadHome);

user_route.get("/login", auth.isLogout, userController.loginLoad);

user_route.post("/login", userController.verifyLogin);

user_route.get("/home", auth.isLogin, userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout);

user_route.get('/products',userController.productsLoad)

user_route.get("/register", auth.isLogout, userController.loadRegister);

// user_route.post("/register", userController.insertUser);

user_route.get('/productDetails',userController.productDetails);

user_route.get('/shop',userController.shop);

user_route.post('/register',userController.loadOtp);

user_route.get('/resendOtp',userController.resendOtp)

user_route.get('/otp',userController.loadOtp)

user_route.post('/otpverify',userController.verifyOtp);

user_route.get('/addToCart',auth.isLogin,cartController.addToCart);

user_route.get('/cart',auth.isLogin,cartController.loadCart)

user_route.post('/editCart',cartController.editCart)

user_route.get('/deleteCart',cartController.deleteCart)

user_route.get('/userProfile',auth.isLogin,userController.userProfile)

user_route.get('/editUser',auth.isLogin,userController.editUser)

user_route.post('/editUser',userController.updateUser)

user_route.post('/addAddress',auth.isLogin,userController.addAddress)

user_route.get('/deleteAddress',userController.deleteAddress)

user_route.get('/checkout',userController.loadCheckout)

user_route.post('/checkout',auth.isLogin,userController.storeOrder)

user_route.get('/orderSuccess',auth.isLogin,userController.loadSuccess)

user_route.get('/cancelOrder',auth.isLogin,userController.cancelOrder)

user_route.get('/viewOrder',auth.isLogin,userController.viewOrder)

// user_route.get('/orderSuccess',auth.isLogin,userController.orderSuccess)

user_route.post('/addCoupon',auth.isLogin,offerController.applyCoupon)

user_route.post('/returnOrder',auth.isLogin,orderController.returnOrder)

user_route.get('/razropayPayment',auth.isLogin,userController.razropayPayment)

user_route.post('/updateCart',cartController.updateCart)

user_route.get('/loadReview',auth.isLogin,orderController.loadReview)

user_route.post('/postReview',auth.isLogin,orderController.postReview)



















module.exports = user_route;
