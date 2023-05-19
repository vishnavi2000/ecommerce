const User=require('../models/userModel')
const product=require('../models/productModel')

const loadCart =async(req,res)=>{ 
    try{
        userSession=req.session
        console.log(req.session);
        const userData=await User.findById({_id:userSession.user_id})
        const completeUser = await userData.populate('cart.item.productId')
        // console.log('1');
        // console.log(completeUser);

        res.render('cart',{
            id:userSession.user_id,
            cartProducts:completeUser.cart
        })
    }

    catch(error){
        console.log(error);
    }
}
const addToCart =async(req,res,next)=>{
    try{
       const productId =req.query.id
       userSession =req.session
       const userData =await User.findById({_id:userSession.user_id})
       const productData= await product.findById({_id:productId})
       userData.addToCart(productData)
       res.redirect('/Shop')
}catch(error){
   console.log(error.message);
}
} 


const editCart= async (req,res)=>{
    try{
        const id=req.query.id;
        // console.log('.01');
        // console.log(id);
        const userSession =req.session;
        const userData =await User.findById({_id: userSession.user_id})
        // console.log('1');
        console.log(userData);
        // console.log('2');
        const foundProduct =userData.cart.item.findIndex(
            (objInItems) => objInItems._id==id
        )

        
        
        // console.log('3');
        console.log(foundProduct);
        // console.log('4');
        // console.log('5');
        userData.cart.item[foundProduct].qty=req.body.qty
        userData.cart.totalPrice =0
        const totalPrice =userData.cart.item.reduce((acc,curr)=>{
            return acc + curr.price*curr.qty
        },0)
        userData.cart.totalPrice=totalPrice
        await userData.save()
        res.redirect('/cart')

    }catch(error){
        console.log(error.message);

    }
}

const deleteCart =async(req,res) =>{
    try{
        console.log('1');
        const productId=req.query.id
        console.log(productId);
        
        userSession =req.session
        const userData =await User.findById({_id:userSession.user_id})
        userData.removefromCart(productId)
        res.redirect('/cart')
    }catch(error){
        console.log(error.message);
    }
}

const updateCart=async(req,res)=>{
    try{
        let {quantity,_id} = req.body
        console.log("quan==="+quantity);
        console.log("id======"+_id);
        const userData=await User.findById({_id:req.session.user_id})
        const total=await userData.updateCart(_id,quantity)
        res.json({total})

    }catch(error){
        console.log(error);
    }
}


module.exports={
    loadCart,
    addToCart,
    editCart,
    deleteCart,
    updateCart
    

};




