const Order=require('../models/ordersModel')
const Product=require('../models/productModel')
const User=require('../models/userModel')

let orderType = "all";

const orderList=async(req,res)=>{
  try{
    const productData = await Product.find()
    const userData=await User.find({is_admin:0})
    const orderData=await Order.find().sort({createdAt:-1})
    for(let key of orderData){
      await key.populate('products.item.productId');
      // await key.populate('userId')
      // await key.populate('User.name')
    }
    if(orderType==undefined){
      res.render('orderList',{users:userData,product:productData,order:orderData})
    }else{
      id=req.query.id;
      res.render('orderList',{users:userData,product:productData,id:id,order:orderData})
    }

  }catch(error){
    console.log(error.message);
  }
}

const cancelOrder = async (req, res) => {
  const id = req.query.id;
  await Order.deleteOne({ _id: id });
  res.redirect("/admin/orderList");
};


const deliveredOrder = async (req, res) => {
  const id = req.query.id;
  await Order.updateOne({ _id: id }, { $set: { status: "Delivered" } });
  res.redirect("/admin/orderList");
};


const confirmOrder = async (req, res) => {
  const id = req.query.id;
  await Order.updateOne({ _id: id }, { $set: { status: "Comfirmed" } });
  res.redirect("/admin/orderList");
};


const UpdateOrder = async (req, res) => {
  try {
      // const status=req.body.status
      
      let orderId = req.body.orderid;
     const a = await Order.findByIdAndUpdate({_id:orderId},{$set:{status:req.body.status}})
      console.log('2');
      res.redirect("/admin/orderList")
  } catch (error) {
      console.log(error.messaage);
  }
}


const detailView = async(req,res)=>{
  try{
    const id=req.query.id
    const userData=await User.find({is_admin:0})
    const orderData= await Order.findById({_id:id})
    await orderData.populate('products.item.productId')
    res.render('detailView',{order:orderData,user:userData})
 
    

  }catch(error){
    console.log(error.messaage);
  }
}


// const returnOrder=async(req,res)=>{
//   try{
    
//     const id=req.body.order
//     // await Orders.deleteOne({_id:id})
//     console.log('100');
//     console.log(id);
//     console.log('200');
//     const userSession=req.session
//     if(userSession.user_id){
//       console.log(userSession.user);
//         const orderData=await User.findById({_id:userSession.user_id})
//         console.log("orderData===="+orderData);
//         const productData=await Product.find()
//         // console.log(productData);
//         console.log("cart item====="+orderData.cart.item);
//         console.log("product_data======="+orderData.products.item);
//         for(let key of orderData.cart.item){
//             for(let prod of productData){
//                 if(new String(prod._id).trim()==new String(key.productId).trim()){
//                     prod.quantity=prod.quantity+key.qty
//                     console.log("cart-plus==========="+prod.quantity);
//                     await prod.save()
//                 }
//             }
//         }
//         await Order.updateOne({_id:id},{$set:{status:"Order Returned"}})
        
//     }
    
   
//     res.redirect('/userProfile')

//   }catch(error){
//     console.log(error);
//   }


    
 
// }
let walletAmount=0;
let totalWallet;
const returnOrder = async (req,res)=>{
  try {

     const id=req.body.order
    console.log(id);
    const user=userSession.user_id
   
   
   if(user){
    const  orderData= await Order.findById({_id:id})
      walletAmount=orderData.products.totalPrice
      const userData=await User.findById({_id:user})
     totalWallet=userData.wallet
     console.log(totalWallet);
     console.log(walletAmount);
      const totalWalletAmount=totalWallet+walletAmount
     console.log(totalWalletAmount);


      // console.log(typeof(totalWallet));

      // console.log("total==="+totalWallet);

      // console.log(user);
      await User.updateOne({_id:user},{$set:{wallet:totalWalletAmount}})
      const userDetails = await User.findOne({_id:user})
      console.log("userData===="+userDetails);
    const productData=await Product.find()
    for(let key of orderData.products.item){
      for(let prod of productData){
        if(new String(prod._id).trim()==new String(key.productId).trim()){
          prod.quantity=prod.quantity+key.qty
          await prod.save()
        }
      }
    }
    await Order.updateOne({_id:id},{$set:{status:"Order Returned"}})

   }



  } catch (error) {
    console.log(error);
  }
}

const loadReview=async(req,res)=>{
  try {
    
    userSession=req.session
    if(userSession.user_id){
      const id=req.query.id;
      const orderData=await Order.findOne({_id:id})
      const userData =await User.findOne({_id:userSession.user_id})
      await orderData.populate('products.item.productId')
      
      res.render('review',{user:userData,order:orderData})
    }else{
      res.render('login')
    }
    
  } catch (error) {
    console.log(error);
  }
}

const postReview=async(req,res)=>{
  try {
  const user=req.session.user
    const review=req.body.rev
    const id=req.body.id
    console.log(review);
    console.log(user);
    newrev ={
      review:review,
      username:user 
    }
    const productData=await Product.updateOne({_id:id},{$push:{review:newrev}})
   console.log(productData);

    
    
  } catch (error) {
    console.log(error);
    
  }   
}

module.exports={

    orderList,
    cancelOrder,
    deliveredOrder,
    confirmOrder,
    UpdateOrder,
    detailView,
    returnOrder,
    loadReview,
    postReview
    


}