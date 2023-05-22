const fast2sms=require('fast-two-sms')

const sendMessage=function(mobile,res){
    // let randomOtp=Math.floor(Math.random()*10000)
    let randomOtp=1234;
    var options ={
        authorization:"LpKOkcUND4ClatShjgRIH2FVPG1wbn7sx9BfZeE03QrozXA6WdbwJ2VIs6laoPdzDC14KrOtWTuRA0vm",
   
        message:`your otp verfication code is ${randomOtp}`,

        numbers:[mobile]
    }
    fast2sms.sendMessage(options)
    .then((response)=>{
        console.log('otp sent successfully ');
    }).catch((error)=>{
        console.log(error);
    })
    return randomOtp

}

module.exports={
    sendMessage
}
let  a =10;
let h =30;