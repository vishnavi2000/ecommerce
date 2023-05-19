const Banner=require('../models/bannerModel')

const addBanner=async(req,res)=>{
  try{
    const newBanner = req.body.banner
    const a=req.files
    const banner=new Banner({
      banner:newBanner,
      bannerImage:a.map((x)=>x.filename),
      is_active:1
    })
    const bannerData=await banner.save()
    if(bannerData){
      res.redirect('banner')
    }

  }catch(error){
    console.log(error.messaage);
  }
  
}

const loadBanner=async(req,res)=>{
  try{
    const bannerData=await Banner.find()
    
    res.render('banner',{banner:bannerData})
  }catch(error){
    console.log(error.messaage);
  }
}

const chooseBanner=async(req,res)=>{
  try{
    const id=req.query.id
  //   const bannerData=await Banner.findById({_id:id})
  //   console.log(bannerData);
  //   if(bannerData.is_active){
  //     await Banner.findByIdAndUpdate({_id:id},{$set:{is_active:0}})
  //   }else{
  //  await Banner.findByIdAndUpdate({_id:id},{$set:{is_active:1}})
  await Banner.findOneAndUpdate({is_active:1},{$set:{is_active:0}})
  await Banner.findByIdAndUpdate({ _id: id },{$set:{is_active:1}})
  //   }
    res.redirect('/admin/banner')
    
    
  }catch(error){
    console.log(error);

  }
}


const deleteBanner=async(req,res)=>{
  try{
    const id=req.query.id;
    await Banner.deleteOne({_id:id})
    res.redirect('/admin/banner')


  }catch(error){
    console.log(error);
  }
}

module.exports={
    addBanner,
    loadBanner,
    chooseBanner,
    deleteBanner
}