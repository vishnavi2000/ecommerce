const User = require('../models/userModel')
const product=require('../models/productModel')
const Address=require('../models/addressModel')
const Orders=require('../models/ordersModel')
const Banner=require('../models/bannerModel')
const Offer=require('../models/offerModel')
const Category = require('../models/categoryModel')
const bcrypt = require('bcrypt');
const sms=require('../middleware/sms')
//  const { render } = require('../routes/userRoute');
require ('dotenv').config();

const RazorPay=require('razorpay')
const path=require('path')






const loadRegister = async (req, res) => {
    try {
        res.render('registration')

    }
    catch (error) {
        console.log(error.message)
    }
}


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message) 
    }
}
// const insertUser = async (req, res) => {
//     try {

//         const spassword = await securePassword(req.body.password);
//         // console.log("sp"+spassword)
//         const user = new User({
//             name: req.body.name,
//             email: req.body.email,
//             mobile: req.body.mno,
//             password: spassword,
//             is_admin: 0

//         });
//         // if(user.name == ""){
//         //     res.render('registration', { nameMessage: "enter your name" })
//         // }

//         const userData = await user.save();
//         newUser =userData._id
//         console.log(userData);
//         if(userData){
//         res.redirect('/otpVerify')
//         }

//         // if (userData) {
//         //     res.render('registration', { message: "your registration is succesful" })
//         // }
//         // else {
//         //     res.render('registration', {message:"your registration is failed"})
//         // }

//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }



//load otp//

// const loadOtp= async(req,res)=>{
//     const userData =await User.findById({_id:newUser})
//     const otp=sendMessage(userData.number,res)
//     console.log(otp);
//     newOtp =otp
//     console.log('OTP:',otp);
//     res.render('otpVerify',{otp:otp,user:newUser})

// }



// const loadOtp =async(req,res)=>{
//     const userData =await User.findById({_id:newUser})
//     const otp=sendMessage(userData.mobile,res)
//     newOtp=otp
//     console.log('otp:',otp);
//     res.render('otpVerify',{otp:otp,user:newUser})
// }
// //verify otp
// const verifyOtp = async(req,res)=>{
// try{
//     const otp=newOtp
//     const userData=await User.findById({_id:req.body.user})
//     if(otp==req.body.otp){
//         const user=await userData.save()

//         if(user){
//             res.redirect('/login')
//         }
//     }else{
//         res.render('otpVerify',{message:"Invalid otp"})
//     }
// }catch(error){
//     console.log(error.message);
// }
// }
// login user 

let user

const loadOtp=async(req,res)=>{
    const verify = await User.findOne({$or:[{email:req.body.email}]})
    if(verify){
        res.render('registration',{message:'user is already exists'})
    }else{
        const spassword=await bcrypt.hash(req.body.password,10)
        user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            password:spassword,
            is_admin:0,
        })
       
        newotp =sms.sendMessage(req.body.mno,res)
        
        console.log(newotp);
        res.render('otpVerify',{otp:newotp})
    }
}

function resendOtp(req,res){
    newotp=sms.sendMessage(req.body.mno,res)
    console.log(newotp);
    res.render('otpVerify',{otp:newotp})
    
}


const verifyOtp = async(req,res)=>{
    try{
        if(req.body.checkOtp == req.body.otp){
            const userData= await user.save()
            if(userData){
                res.redirect('/login')
            }else{
                res.render('registration',{message:'your registraction is failed'})
            }
        }else{
            res.render('registration',{message:'otp failed'})
            console.log('otp is incorrect');
        }
    }catch(error){
        console.log(error.message);
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render('login');
    }
    catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email,is_admin:0});
       
         
           // console.log("user:"+userData)
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            // console.log("user p:"+password)
            // console.log("diclear p:"+userData.password)
            // console.log("user:"+passwordMatch)
            if (passwordMatch) {
                // console.log("hai : " + userData._id)
                if(userData.is_status){

                req.session.user_id = userData._id;
                req.session.user=userData.name;
                req.session.user1 = true
                
                // console.log(req.session)
                res.redirect('/')
            }else{
                res.render('login', { message: 'sorry you are blocked'})
            }
        }

            else {
                res.render('login', { message: 'email and password are incorrect' })
            }
        }
        else {
            res.render('login', { message: 'email and password are incorrect' })
        }



    }
    catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res, next) => {
    try {
        const id=req.session.user_id
        console.log("userData===="+id);

        const products = await product.find({isAvilable:1})
        const bannerData=await Banner.find({is_active:1})
        const userData=await User.findOne({_id:id})
        
        
        if(req.session.user1){sess = true} else sess = false;
            res.render('home',{users : sess,
                products:products,
                banner:bannerData,
                
            })
    }
    catch (error) {
        next(error);
    }
}

const userLogout = async (req, res) => {
    try {
        console.log("bdhfj");
        req.session.user1 = null;
        res.redirect('/')
    }
    catch (error) {
        console.log(error.message)
    }

}


const productsLoad =async(req,res)=>{
   
    try{
    const userDatas = await User.findOne({_id:req.session.user_id})
    const products =await product.find({isAvilable:1})
    console.log(products);
    
    res.render('home',{
    
        user:userDatas,
        products:products,
        
        
    })
}catch (error) {
    console.log(error.message);
}
};

const productDetails =async(req,res)=>{
   
    try{
        // console.log('1');
    const id=req.query.id;
    // console.log(id);
    // console.log('2');
   
    const productDetails = await product.findOne({_id:id})
    console.log(productDetails);
    const userDatas = await User.findOne({_id:req.session.user_id});


    res.render('productDetails',{
        user:userDatas,
        productImg:productDetails});
        console.log(productDetails);
       
    } 
    catch(error){
        console.log(error.message);
    }
}

const shop=async(req,res)=>{
            try {
                const categoryData = await Category.find()
                let { search, sort, category, limit, page, tf } = req.query
                if (!search) {
                    search = ''
                }
                skip=0
                start = 0
                end = 50000
                let nlimit
                if(!limit){ 
                    nlimit=15
                }else{
                    nlimit = parseInt(limit)
                }
                if(!page){
                    page=0
                }
                skip=page*nlimit
                console.log(category); 
                let arr = []
                if (category) {
                    categories = category.split(',')
                    for (i = 0; i < categories.length; i++) {
                        arr = [...arr, categoryData[categories[i]].name]
                    }
                } else {
                    category = []
                    arr = categoryData.map((x) => x.name)
                }
                console.log('sort ' + sort);
                console.log('category ' + arr);
                console.log(limit,page,tf);
                if (sort == 0) {
                    productData = await product.find({ isAvailable:1, $and: [{ category: arr }, { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({$natural:-1})
                    pageCount = Math.floor(productData.length/nlimit)
                    if(productData.length%nlimit >0){
                        pageCount +=1
                    }
                    console.log(productData.length + ' results found '+pageCount);
                    productData = await product.find({ isAvailable:1, $and: [{ category: arr }, { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({$natural:-1}).skip(skip).limit(limit)
                } else {
                    productData = await product.find({ isAvailable:1, $and: [{ category: arr }, { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort })
                    pageCount = Math.floor(productData.length/nlimit)
                    if(productData.length%nlimit >0){
                        pageCount +=1
                    }
                    console.log(productData.length + ' results found '+pageCount);
                    productData = await product.find({ isAvailable:1, $and: [{ category: arr }, { price:{$gte:start,$lte:end} }, { $or: [{ name: { $regex: '' + search + ".*" } }, { category: { $regex: ".*" + search + ".*" } }] }] }).sort({ price: sort }).skip(skip).limit(limit)
                }
                console.log(productData.length + ' results found');
                if (req.session.user) { 
                    userData =await User.findById({ _id:req.session.user_id })
                    session = req.session.user
                } else{
                     session = false
                     userData =''
                }console.log(userData);
                if(pageCount==0){pageCount=1}
                if(tf){
                res.json({products: productData,pageCount,page})
                }else{
                res.render('Shop', { user: userData, products: productData, category: categoryData, val: search, selected: category, order: sort, limit: limit,pageCount,page, head: 2 })
                }
            } catch (error) {
                console.log(error.message);
            }
        }


const otp=async(req,res)=>{
    try{
        
        res.render('otpVerify')
    }catch(err){
        console.log(err.message);
    }  
}




const addAddress =async(req,res)=>{
    try{
        userSession = req.session
        console.log(userSession.user_id);
        const addressData=Address({
            userId:userSession.user_id,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            country:req.body.country,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip,
            mobile:req.body.mno,

        })
        await addressData.save();
        res.redirect('/userProfile')
    }catch(error){
        console.log(error.message);
    }
}


const deleteAddress=async(req,res)=>{
    try{
        userSession =req.session
        id=req.query.id;
        
        
        await Address.findByIdAndDelete({_id:id})
       
        res.redirect('/userProfile')


    }catch(error){
        console.log(error.message);
    }
}
const userProfile =async(req,res)=>{
    try{
        userSession =req.session;
        const userData = await User.findById({_id: userSession.user_id})
        // console.log(userData);
        // const orderData=await Orders.find({userId:userSession.user_Id})
        console.log("wallet amount==="+userData.wallet);
        const walletAmount=userData.wallet
        const orderData = await Orders.find({ userId: userSession.user_id }).sort({$natural:-1})
        const addressData =await Address.find({userId: userSession.user_id})
       

        res.render('userProfile',{user:userData,userAddress:addressData, userOrders:orderData,wallet:walletAmount})
    }catch(error){
        console.log(error.message);
    }
}

const loadCheckout =async(req,res)=>{
    try{
        userSession = req.session
        
        if(userSession.user_id){
            const id = req.query.addressid;
            const userData = await User.findById({_id:userSession.user_id})
            const completeUser = await userData.populate('cart.item.productId')
            const addressData = await Address.find({user_id:userSession.user_id})
            const selectAddress = await Address.findOne({_id:id});
            const coupon =await Offer.find()
            
            const walletTotal=userData.wallet
            console.log("wallet dataa====="+walletTotal);

            
            res.render('checkout',{id:userSession.user_id,cartProducts:completeUser.cart,addSelect:selectAddress,userAddress:addressData,walletTotals:walletTotal})
        }else{
            res.render('checkout',{id:userSession.user_id})
        }

    }catch(error){
        console.log(error.message);
    }
}


 let order
const storeOrder=async(req,res)=>{
    try{
        userSession=req.session
        if(userSession.user_id){
            const userData=await User.findById({_id:userSession.user_id})
            const completeUser=await userData.populate('cart.item.productId')
            
            
            const totalPrice=userSession.couponTotal||completeUser.cart.totalPrice;
            let updateTotal=totalPrice;
            userData.cart.totalPrice =updateTotal
            const updateUserData=await userData.save()

            if(completeUser.cart.totalPrice >0){
              
                order =Orders({
                    userId:userSession.user_id,
                    payment:req.body.payment,
                    country:req.body.country,
                    address:req.body.address,
                    city:req.body.city,
                    state:req.body.state,
                    zip:req.body.zip,
                    products:completeUser.cart
                    
                })
               
                 console.log("payment=="+req.body.payment);
                if(req.body.payment == 'Cash-on-Dilevery'){
                    res.redirect('/orderSuccess')
                    console.log("vaishnavi");
                }else {
                    
                    var instance = new RazorPay({
                      key_id:process.env.KEY_ID,
                      key_secret:process.env.KEY_SECRET
                    })
                    let razorpayOrder = await instance.orders.create({
                        amount:totalPrice*100,
                        currency:'INR',
                        receipt:order._id.toString()
                    })
                    console.log('order Order created', razorpayOrder);
                    res.render("razropayCheckout", {
                      userId:req.session.user_id,
                      order_id:razorpayOrder.id,
                      total: totalPrice,
                      session: req.session,
                      key_id: process.env.key_id,
                      user: userData,
                      order: order,
                      orderId: order._id.toString()   
                    });
                  } 
            }
        }

    }catch(error){
        console.log(error.message);
    }
}


const loadSuccess = async (req,res)=>{
    try{
        userSession=req.session
        
        
        if(userSession.user_id){
            const userData=await User.findById({_id:userSession.user_id})
            
            const productData=await product.find()
            const orderData=await order.save()
            for(let key of userData.cart.item){
                for(let prod of productData){
                    if(new String(prod._id).trim()==new String(key.productId).trim()){
                        prod.quantity=prod.quantity-key.qty
                        console.log("cart-minus========"+prod.quantity);
                        await prod.save()
                    }
                }
            }
            await Orders.updateOne({_id:userSession.user_Id,_id:userSession.currentOrder},{$set:{'status':'Build'}})
            
            
            await User.updateOne({_id:userSession.user_id},{$set:{'cart.item':[],'cart.totalPrice':'0'}},{multi:true})
            res.render('orderSuccess',{user:userData})
        }
    }catch(error){
        console.log(error.message);
    }
}

const razropayPayment=async(req,res)=>{
    try{
        
        res.render('razropayCheckout')

    }catch(error){

    }
}

const cancelOrder = async(req,res)=>{
    try {
        const id=req.query.id
        // await Orders.deleteOne({_id:id})
        console.log(id);
        const myOrder = await Orders.findById({_id : id})
        const userSession=req.session
        if(userSession.user_id){
            const orderData=await User.findById({_id:userSession.user_id})
            const productData=await product.find()
            for(let key of orderData.cart.item){
                for(let prod of productData){
                    if(new String(prod._id).trim()==new String(key.productId).trim()){
                        prod.quantity=prod.quantity+key.qty
                        console.log("cart-plus==========="+prod.quantity);
                        await prod.save()
                    }
                }

            }  
            myOrder.status = "Cancelled"
            myOrder.save();
            console.log("Order Cancelled");
        }
        
       
        res.redirect('/userProfile')
        
    } catch (error) {
        console.log(error);
    }
}

const viewOrder= async(req,res)=>{
    try{
        userSession=req.session
        if(userSession.user_id){
            const id=req.query.id
            userSession.currentOrder = id
            const orderData = await Orders.findOne({_id:id})
            const userData =await User.findOne({_id:userSession.user_id})
            await orderData.populate('products.item.productId')
            
            res.render('viewOrder',{order:orderData,user:userData})
        }else{
            res.render('login')
        }
    }catch(error){
        console.log(error);
    }
    }

    const editUser =async(req,res)=>{
        const id=req.query.id
        const userData=await User.findById({_id:id})
        res.render('editUser',{user:userData})
    }

const updateUser=async(req,res)=>{
    const productData =await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
    res.redirect('/userProfile')

}

// const orderSuccess=async(req,res)=>{
//     try{
//         const id=req.session.user_id;
//         console.log(id);
//         res.render('orderSuccess')
//     }catch(error){
//         console.log(error.message);
//     }
// }











module.exports = {
    loadRegister,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    productsLoad,
    productDetails,
    shop,
    otp,
    loadOtp,
    verifyOtp,
    userProfile,
    addAddress,
    deleteAddress,
    loadCheckout,
    storeOrder,
    loadSuccess,
    cancelOrder,
    viewOrder,
    editUser,
    updateUser,
    // orderSuccess,
    resendOtp,
    razropayPayment
} 