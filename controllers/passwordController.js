const User =require('../models/userModel')
const bcrypt =require('bcrypt')
const userController=require('../controllers/userController')
const sms=require('../middleware/sms')



const mobVerify=async(req,res)=>{
    try{
        res.render('mobVerify')

    }catch(error){
        console.log(error.message);
    }
}
let userMob
const verifyOtpPassword=async(req,res)=>{
try{
 userMob=req.body.mobile
 
 console.log('mobile='+userMob);
 
 const user=await User.find()
 userDetails=await User.findOne({mobile:userMob})
console.log(userDetails);
 if(userDetails){
    newOtp=sms.sendMessage(userMob,res);
    console.log(newOtp);
    res.render('pswOtp',{otp:newOtp,mob:userMob})
 }else{
    res.render('mobVerify')
 }

}catch(error){
    console.log(error.message);
}

}

const verifyOtp=async(req,res)=>{
    try{

        const otp=req.body.otp
        const mob=req.body.mob
        console.log("mobile===="+mob);
        const userOtp=req.body.mobOtp
        if(otp==userOtp){
            
            res.render('rePassword',{mob:mob})
        }else{
            res.render('login',)
        }
    

    }catch(error){
        console.log(error.message);
    }

}

const rePassword=async(req,res)=>{
    try{
    const mob=userMob
   
    const password=req.body.password
   
    const hash=await bcrypt.hash(password,10)
    console.log("mobile2===="+mob);
    const userData=await User.updateOne({mobile:mob},{$set:{password:hash}})
    if(userData){
        res.render('login',{message:'Password changed Successfully'})
    }
    else{
        res.render('registration')
    }

    }catch(error){
        console.log(error.message);
    }
    
}
function resendOtp(req,res){
    const mobile=req.body.mobile
    newotp=sms.sendMessage(req.body.mno,res)
    console.log(newotp);
    res.render('pswOtp',{otp:newotp,mob:mobile})
    
}




module.exports={
    mobVerify,
    verifyOtpPassword,
    verifyOtp,
    rePassword,
    resendOtp

    
}

