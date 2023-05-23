const Offer=require('../models/offerModel')
const user=require('../models/userModel')
const Product=require('../models/productModel')


const offer=async(req,res)=>{
  try{
    const OfferData=await Offer.find()
    
    res.render('offer',{offer:OfferData})
  }catch(error){
    console.log(error);
  }
}

const addOffer=async(req,res)=>{
  try{
    // console.log("hi 1");
    const OfferData=Offer({
      name:req.body.name,
      type:req.body.type,
      discount:req.body.discount,
      min_value:req.body.min_value,
      max_discount:req.body.max_discount
    })
    await OfferData.save()
    // console.log("hi2");
    res.redirect('offer')
    // console.log("hi3");
    


  }catch(error){
    console.log(error);
  }
}

const deleteOffer=async(req,res)=>{
  try{
    const id=req.query.id
    await Offer.deleteOne({_id:id})
    res.redirect('offer')

  }catch(error){
    console.log(error);
  }
}
// const applyCoupon=async(req,res)=>{
//   let couponDiscount
//   let couponSave
//   try {
//     const {coupon}=req.body;
//     const {user_id}=req.session
//     let message=""
//     const User = await user.findById(user_id).populate("cart.item.productId");

//     const couponData = await Offer.findOne({name:coupon})
//     console.log(couponData);
//     console.log(User.cart.totalPrice);

//     if(!couponData){
//       throw new Error("coupon not found")
//     }
//     req.session.offer={
//       name:couponData.name,
//       type:couponData.discount,
//       discount:couponData.discount
//     }
//     let totalPrice=Number(User.cart.totalPrice);
//     if(isNaN(totalPrice)){
//       throw new Error("total price is NaN")
//     }
//     let updateTotal;
//     if(couponData.usedBy.includes(user_id)){
//       message="coupon is already used"
//     }else if(User.cart.totalPrice >= couponData.min_value){
//       updateTotal=totalPrice*(1-couponData.discount/100);

//       console.log("update total=="+updateTotal);
//     }else{
//       message +="Minimum order value is "+couponData.min_value
//     }
//     console.log("message"+message);
//     req.session.couponTotal=updateTotal;
//     couponDiscount=couponData.discount
//     maxAmount=totalPrice-updateTotal
//     console.log(couponSave);
//     res.json({updateTotal,couponDiscount,maxAmount,message})
    
//   } catch (error) {
//     console.log(error);
    
//   }
// }


const applyCoupon = async (req, res) => {
  console.log("sdarffd123456");
  let couponDiscount;
  let couponSave;
  try {
    const { coupon } = req.body;
    const { user_id } = req.session;
    let message = "";
    const User = await user.findById(user_id).populate("cart.item.productId");

    const couponData = await Offer.findOne({ name: coupon });
    console.log(couponData);
    console.log(User.cart.totalPrice);

    if (!couponData) {
      throw new Error("Coupon not found");
    }

    if (couponData.isExpired) {
      throw new Error("Coupon has already expired");
    }

    req.session.offer = {
      name: couponData.name,
      type: couponData.discount,
      discount: couponData.discount,
    };

    let totalPrice = Number(User.cart.totalPrice);
    if (isNaN(totalPrice)) {
      throw new Error("Total price is NaN");
    }

    let updateTotal;
    if (couponData.usedBy.includes(user_id)) {
      message = "Coupon is already used";
    } else if (User.cart.totalPrice >= couponData.min_value&& User.cart.totalPrice <= couponData.max_value) {
      updateTotal = totalPrice * (1 - couponData.discount / 100);

      console.log("Update total: " + updateTotal);
    } else {
      message += "Minimum order value is " + couponData.min_value;
    }

    console.log("Message: " + message);
    req.session.couponTotal = updateTotal;
    couponDiscount = couponData.discount;
    maxAmount = totalPrice - updateTotal;

    couponData.isExpired = true;
    await couponData.save();

    console.log(couponSave);
    res.json({ updateTotal, couponDiscount, maxAmount, message });
  } catch (error) {
    console.log(error);
  }
};



module.exports={
    offer,
    addOffer,
    deleteOffer,
    applyCoupon
    


}