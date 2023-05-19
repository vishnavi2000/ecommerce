const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/attireCloting");
mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/newProject");
const errorHandler = require('./middleware/errorHandler')

const nocache = require("nocache");

const express = require("express");
const app = express();

app.use(express.static('public'));
app.use(express.json())
app.use(nocache())
app.use(express.urlencoded({ extended: true }));
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const passwordRoute = require('./routes/passwordRoute')
app.use("/password",passwordRoute)

const adminRoute = require("./routes/adminRoute");

app.use("/admin", adminRoute);

app.use(errorHandler);

app.get('*',function(req,res){
  res.status(404).render('404.ejs')
})


app.listen(4000, function () {
  console.log("server is running at 4000");
});
