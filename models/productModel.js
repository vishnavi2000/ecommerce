const mongoose=require('mongoose')

const addproduct =new mongoose.Schema({
    name:
    {
    type:String,
    required:true
    },
    category:{
        type:String
    },
    price:{
        type:Number,
        required:true,

    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
   
    isAvilable:{
        type:Number,
        default:1
    },
    image:{
        type:Array,
        required:true
    },
    review:[{
        username:{          
            type:String,
        },
        review:{
             type:String
        }
    }
    ],


});
module.exports=mongoose.model('Products',addproduct)