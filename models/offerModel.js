const mongoose=require('mongoose')

const OfferSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    min_value:{
        type:Number,
        required:true

    },
    // max_value:{
    //     type:Number,
    //     required:true
    // },
    max_discount:{
        type:Number,
        required:true

    },
    isExpired:{
        type:Boolean,
        default:false
    },
    usedBy:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
    
})

module.exports=mongoose.model('Offer',OfferSchema)
