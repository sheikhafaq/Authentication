require("dotenv").config();
const express =require("express");
const bodyPerser= require("body-parser");
const ejs=require("ejs");
const mongoose =require("mongoose");
const encrypt= require("mongoose-encryption");
const app= express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyPerser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User =new mongoose.model("User", userSchema);

app.get("/unf", function(req, res){
  res.render("unf");
});

app.get("/wrongpassword", function(req, res){
  res.render("wrongpassword");
});

app.get("/uae", function(req, res){
  res.render("uae");
});


app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  const username= req.body.username;


  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
      res.redirect("/uae");
      }else{
        const newUser =new User({
          email: req.body.username,
          password: req.body.password
        });
        newUser.save(function(err){
          if(!err){
            res.render("secrets");
          }else{
            console.log(err);
          }
        });
      }
    }
  });


});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  const username= req.body.username;
  const password =req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.redirect("/wrongpassword");
        }
      }else{
        res.redirect("/unf");
      }
    }
  });
});




app.listen(3000, function(){
  console.log("server started!!!!!");
});
