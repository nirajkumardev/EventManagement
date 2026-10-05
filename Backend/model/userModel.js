const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
  firstName :{type : String, require :true},
  lastname :{type: String},
  email :{
    type: String,
    require: true,
    unique :[true, "Email is Already Rejesterd Go to Login Page"],
  },
  role:{type: String, require : true, enum:['user','admin'], default:'user'},
  password:{typer : String, require: true},
  isVerfyed:{type : Boolean, default : false},
});

mongoose.exports=mongoose.model("user", userSchema);