const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport")

//passport config
require("./config/passport")(passport);

//dbconfig
const db = require("./config/keys").mongoURI;



//connect to mongo
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(console.log("mongodb connected...."))
.catch(err =>console.log(err));

//ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

//bodyparser
app.use(express.urlencoded({extended:false}));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();

})

//rutes
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

const port = process.env.PORT || 5000; 
app.listen(port, console.log(`service started on ${port}`));