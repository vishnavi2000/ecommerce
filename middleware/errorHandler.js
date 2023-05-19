// error handler 

const errorShow = (err,req,res,next) => {
    if(err){
        res.render('404.ejs')
        console.log(err);
    }
}

module.exports = errorShow;