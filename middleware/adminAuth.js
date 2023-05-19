// const { clearCache } = require("ejs");

const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            
        }
        else {
            res.redirect('/admin');
           
        } next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admin');
        }
        else{
            next();
        }
        

    } catch (error) {
        console.log(error.message)
    }
}
// const isRegisterLogout = async(req,res,next)=>{
//     try {
//         if (req.session.admin_id) {
//             res.redirect('/admin/home');
//         }
//         else if(req.session.user_id)
//         res.redirect('/home')
//         next();


        
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }

module.exports = {
    isLogin,
    isLogout,
    // isRegisterLogout
}