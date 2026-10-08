const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
  firstname :{type : String, required :true},
  email :{
    type: String,
    required: true,
    unique :[true, "Email is Already Rejesterd Go to Login Page"],
  },
  role:{type: String, required : true, enum:['user','admin'], default:'user'},
  password:{type : String, required: true},
  isVerfyed:{type : Boolean, default : false},
});

module.exports=mongoose.model("user", userSchema);