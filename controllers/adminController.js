const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order =require('../models/ordersModel')
const Banner=require('../models/bannerModel')
const Offer=require('../models/offerModel')
const objectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const fs = require('fs');
const multer = require('multer')
const path = require('path');
const { deleteOne } = require("../models/productModel");


// const randomstring = require("randomstring");

let staff = false

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/admin/assets/img/products/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: Storage,
}).single("images");




const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};


const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email});

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", { message: "email and password incorrect" });
        } else if(userData.is_admin === 2){
          req.session.admin_id = userData._id;
          res.redirect("/admin/dashboard");
        }
        else {
          req.session.admin_id = userData._id;
          res.redirect("/admin/dashboard");
        }
      } else {
        res.render("login", { message: "email and password is incorrect" });
      }
    } else {
      res.render("login", { message: "email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.admin_id });
    res.render("dashboard", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.admin_id = null;
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

const adminDashboard = async (req, res) => {
  try {
    let pds=[],qty=[]
    var search = "";
    if (req.query.search) {
      // console.log("re"+req.query);
      search = req.query.search;
      // console.log("search:"+search);
    }
    const userData = await User.find();
    const productData = await Product.find()
    productData.map(x=>{
      pds=[...pds,x.name]
      qty=[...qty,x.quantity]
    })
    console.log("pds==="+pds);
    console.log("qty==="+qty);



    res.render("dashboard", { users: userData,pds,qty });
  } catch (error) {
    console.log(error.message);
  }
};

const newUserLoad = async (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log(error.message);
  }
};

const loadProduct = async (req,res)=>{
try {
  const productDetails=await Product.find();
  res.render('adminProduct',{product:productDetails});
  
} catch (error) {
  console.log(error);
}
}

const addUser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mno = req.body.mno;
    // const password = randomstring.generate(8);
    const password = req.body.password;
    const spassword = await securePassword(password);

    const user = new User({
      name: name,
      email: email,
      mobile: mno,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();
    if (userData) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "Something Wrong" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mno,
        },
      }
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const adminList=async(req,res)=>{
  try{
    const userData = await User.find({
      is_admin: 0,
      
     
    });
    res.render('userList',{user:userData})
    
  }catch{
    console.log(' userlist went wrong');
  }
}

// const adminProduct=async(req,res)=>{
//   try{
  
//     res.render('adminProduct')
//       }catch(error){
//     console.log('adminProduct went wrong');
//   }
// }

const blockuser = async(req,res)=>{
  try {
      const id = req.query.id
      const userdata = await User.findById({_id:id})
      if(userdata.is_status){
          await User.findByIdAndUpdate({_id:id},{$set:{is_status:0}})
      }
      else{
          await User.findByIdAndUpdate({_id:id},{$set:{is_status:1}})
      }
      res.redirect('/admin/userList')
  } catch (error) {
      console.log(error.message);
  }
}

const adminCategory= async(req,res)=>{
  try {
    const categorydata = await Category.find();
    const session = req.session.admin_id
    if(session){
      staff = true
      res.render("adminCategory",{category:categorydata,mystaff : staff});
    }else{
    res.render("adminCategory",{category:categorydata});
    }
  } catch (error) {
    console.log(error.message);
  }
}

// const loadCategory = async (req, res) => {
//   try {
//     const categorydata = await Category.find();
//     res.render("adminCategory",{category:categorydata});
//   } catch (error) {
//     console.log(error.message);
//   }
// };


const addcategory = async (req, res) => {

  const categoryData= await Category.findOne({name:req.body.category})
  const categoryAll= await Category.find({isAvailable:1})

  if(categoryData){
    res.render("adminCategory",{category:categoryAll, message:'category is already exist'})

  }else{
    try{
  
      const addcategory = Category({
        name: req.body.category
      });
      await addcategory.save();
      // res.render("category_management");
      res.redirect("adminCategory");
  
    } catch (error) {
      console.log(error.message);
    }

  }

  
}
const deleteCategory = async (req,res) =>{
  try{
    const id=req.query.id;
    console.log(id);
    await Category.deleteOne({_id:id});
    res.redirect("adminCategory");

  }catch(err){
    console.log(err);
  }
}


const loadAddProduct =async (req,res) =>{
  try{
    const categorydata=await Category.find();
    
    
    res.render('addProduct',{category:categorydata});
  }catch(error) {
    console.log(error.message);
  }
}


const productManagement=async(req,res)=>{
  try{
    const productDetails=await Product.find();
    const session = req.session.admin_id
   
    
      res.render('adminProduct',{product:productDetails});

  }catch(error){
    console.log(error.message);
  }
}

const addproduct =async(req,res)=>{

  try {
    const addProducts = Product({
      name:req.body.sName,
      category:req.body.sCategory,
            price:req.body.sPrice,
            quantity:req.body.sQuantity,
            description:req.body.sDescription,
            rating:req.body.sRating,
            image:req.files.map((x) => x.filename)
    })
    await addProducts.save();
    const categorySelecter = await Category.find();
    res.render('addProduct',{category:categorySelecter , message:"product adding successfull"})


  }catch(err){
    console.log(err);
  }

}

const editProduct = async(req,res) =>{
  try{
  const id =req.query.id;
  const category = await Category.find();
  const product1 = await Product.findOne({_id:id});
  
  res.render("edit_product",{category:category,product:product1});
}catch (err){

  console.log(err);
}


}



const storeEditProduct=async(req,res)=>{
  try {
    if(req.files.length !=0){
      const productDetails = await Product.findOne({_id:req.query.id})
     
      console.log('1');
      console.log(productDetails);
      console.log('3');
      console.log(req.body.sCategory);
      const oldImg=productDetails.image;
      const newImage=req.files.map((x)=>x.filename)
      const images=oldImg.concat(newImage)
      console.log("new image=="+images);
     await Product.updateOne({_id:req.query.id},{
        $set:{
        
            name:req.body.sName,
            category:req.body.sCategory,
            price:req.body.sPrice,
            quantity:req.body.sQuantity,
            description:req.body.sDescription,
            rating:req.body.sRating,
            image:images
        }
      })


    }else{
      await Product.updateOne({_id:req.query.id},{
        $set:{
          name:req.body.sName,
          category:req.body.sCategory,
          price:req.body.sPrice,
          quantity:req.body.sQuantity,
          description:req.body.sDescription,
          rating:req.body.sRating,
          
        }
      })
    }
    let a =100
    const productData=await Product.find()
    const category = await Category.find();
    res.render('adminProduct',{category:category,product:productData})
    
  } catch (error) {
    console.log(error);
  }
}


const deleteProduct =async(req,res)=>{
  // try{
  //   const id=req.query.id;
  //   const productData= await Product.updateOne(
  //     {_id:id},
  //     {$set:{isAvilable:0}}
  //   );
  //   res.redirect('adminProduct')
   
  // }catch(err){
  //   console.log(err);
  // }

try{
  const id=req.query.id

  const productData=await Product.findById({_id:id})
  if(productData.isAvilable){
    
    await Product.findByIdAndUpdate({_id:id},{$set:{isAvilable:0}})
  }else{
    await Product.findByIdAndUpdate({_id:id},{$set:{isAvilable:1}})
  }
  res.redirect('adminProduct')
}catch(error){
  console.log(error.message);
}

}


const editCategory = async(req,res)=>{
  try{
    const id=req.query.id;
    const category=await Category.findOne({_id:id});
    const catname= category.name;
    res.render('editCategory',{cat:id,catname:catname})

  }catch(err){
    console.log(err);
  }
  
}  
 
const storeCategory =async(req,res)=>{
  try{
 const userData = await Category.findByIdAndUpdate(
    {_id: req.query.id},
    
    {
      $set:{
        name:req.body.catname
      }
    } 
  );
  res.redirect('adminCategory')
  }catch(err){
    console.log(err);
  }
  


}

const updateImage=async(req,res)=>{
  try {
    let{pId,img}=req.body
    console.log(pId,img);
    await Product.updateOne({_id:pId},{$pull:{image:img} })
    const productData=Product.findOne({_id:pId})
    console.log(productData);
    res.send({newImage:productData.image})
    
  } catch (error) {
    console.log(message.error);
  }

}

const deleteSingleImage =async(req,res)=>{
  try {
    let {itemId,imageName} = req.body
console.log(imageName ,itemId);

const productData = await Product.updateOne({_id:itemId},{
  $pull:{image:imageName}
},{upsert:true});

console.log(productData);

res.json({success:true});

    
  } catch (error) {
    console.log(error);
    
  }
}


const salesReport=async (req,res)=>{
  try {
    const orderData= await Order.find()
    console.log(orderData);

    res.render('salesReport',{order:orderData})
    
  } catch (error) {
    console.log(error);
    
  }
}

const salesDownload=async (req,res)=>{
  try {

    const {sDate,eDate}=req.body
    console.log(sDate,eDate);
    const salesReport=await Order.find({createdAt:{$gte:sDate,$lte:eDate}})
    res.send({orderData:salesReport})
    
  } catch (error) {
    console.log(error);
    
  }
}








module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  adminDashboard,
  newUserLoad,
  addUser,
  editUserLoad,
  updateUser,
  deleteUser,  
  adminList,
  // adminProduct,
  loadProduct,
  adminCategory,
  blockuser,
  addcategory,
  // loadCategory,
  deleteCategory,
  loadAddProduct,
  upload,
  productManagement,
  storeEditProduct,
  addproduct,
  editProduct,
  deleteProduct,
  editCategory,
  storeCategory,
  updateImage,
  deleteSingleImage,
  salesReport,
  salesDownload
  

 
 
  
  
  

};
 



