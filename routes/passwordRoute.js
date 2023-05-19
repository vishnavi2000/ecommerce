const express=require('express')
const pswd_route = express()


pswd_route.set("view engine","ejs")

pswd_route.set ("views","./views/users")

const passwordController =require("../controllers/passwordController");


pswd_route.get('/mobVerify',passwordController.mobVerify)

pswd_route.post('/pswOtp',passwordController.verifyOtpPassword)

pswd_route.post('/verifyOtp',passwordController.verifyOtp)

pswd_route.post('/rePassword',passwordController.rePassword)

pswd_route.get('/resendOtp',passwordController.resendOtp)




module.exports= pswd_route;