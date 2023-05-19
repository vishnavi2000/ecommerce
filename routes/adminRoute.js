const express = require("express")
const admin_route = express();
const session = require("express-session");
const nocache = require("nocache")
const adminAuth=require('../middleware/adminAuth')
const Multer=require('../util/multer')
const multer=require('multer')
const path=require('path')
const config = require("../config/config");
admin_route.use(session({ 
    secret: config.sessionSecret,
    resave:false,
    saveUninitialized:true,    
}));

admin_route.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
  });


  // let Storage=multer.diskStorage({
  //   destination:"./public/admin/assets/uploads/",
  //   filename:(req,file,cb)=>{
  //       cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))

  //   }
  // })

  // let upload=multer({
  //   Storage:Storage
  // }).single('sImage')

  
const auth = require("../middleware/adminAuth");



admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');
// admin_route.use(express.static(path.join(__dirname, "public")));
// admin_route.use(express.static('public'));
// const bodyParser = require("body-parser");
// admin_route.use(express.json());
// admin_route.use(express.urlencoded({ extended: true }));
// admin_route.use(nocache());

const adminController = require("../controllers/adminController");
const bannerController = require('../controllers/bannerController')
const offerController = require('../controllers/offerController')
const orderController = require('../controllers/orderController')
admin_route.get('/', auth.isLogout, adminController.loadLogin);

admin_route.post('/', adminController.verifyLogin);

// admin_route.get('/home', auth.isLogin, adminController.loadDashboard); 
admin_route.get("/adminProduct",adminController.loadProduct)

admin_route.get('/logout', auth.isLogin, adminController.logout);

admin_route.get('/dashboard', auth.isLogin, adminController.adminDashboard);

admin_route.get('/new-user', auth.isLogin, adminController.newUserLoad);

admin_route.post('/new-user', adminController.addUser);

admin_route.get('/userlist',adminController.adminList)

admin_route.get('/blockuser',adminController.blockuser)

// admin_route.get('/adminProduct',adminController.adminProduct)

admin_route.get('/adminCategory',adminController.adminCategory)

// admin_route.get('/loadCategory',adminController.loadCategory)

// admin_route.get('/orderList',adminController.orderList)




admin_route.get('/loadAddproduct',adminController.loadAddProduct)

admin_route.get('/deleteProduct',adminController.deleteProduct)



admin_route.post('/addcategory',adminController.addcategory)

admin_route.get('/deleteCategory',adminController.deleteCategory)

admin_route.get('/edit-user', auth.isLogin, adminController.editUserLoad);

admin_route.post('/edit-user', adminController.updateUser)
      
admin_route.get('/delete-user', adminController.deleteUser);


admin_route.get('/productloading',adminController.productManagement)

admin_route.post('/addproduct',Multer.upload.array('images',3),adminController.addproduct)

admin_route.get('/editproduct',adminController.editProduct)

admin_route.post('/storeEditProduct',Multer.upload.array('sImage',10),adminController.storeEditProduct)

admin_route.post('/deleteSingleImage',adminController.deleteSingleImage)

admin_route.get('/editCategory',adminController.editCategory)

admin_route.post('/storeCategory',adminController.storeCategory)

admin_route.get('/orderList',adminAuth.isLogin,orderController.orderList)

admin_route.get('/cancelOrder',adminAuth.isLogin,orderController.cancelOrder)

admin_route.get('/confirmOrder',adminAuth.isLogin,orderController.confirmOrder)

admin_route.get('/deliveredOrder',adminAuth.isLogin,orderController.deliveredOrder)

admin_route.post("/updateOrder",orderController.UpdateOrder)

admin_route.get('/detailView',adminAuth.isLogin,orderController.detailView)

admin_route.get('/banner',auth.isLogin,bannerController.loadBanner)

admin_route.post('/banner',Multer.upload.array('bannerImage',3),bannerController.addBanner)

admin_route.get('/chooseBanner',auth.isLogin,bannerController.chooseBanner)

admin_route.get('/deleteBanner',auth.isLogin,bannerController.deleteBanner)

admin_route.get('/offer',auth.isLogin,offerController.offer)

admin_route.post('/addOffer',auth.isLogin,offerController.addOffer)

admin_route.get('/deleteOffer',auth.isLogin,offerController.deleteOffer)

admin_route.post('/updateImage',adminController.updateImage)

admin_route.get('/salesReport',auth.isLogin,adminController.salesReport)

admin_route.post('/salesDownload',auth.isLogin,adminController.salesDownload)


admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;