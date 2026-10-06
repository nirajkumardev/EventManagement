const OtpModel = require("../model/OtpModel");
const usermodel = require("../model/userModel");
const bcrypt=require("bcryptjs");
const { sendOtpEmail } = require("../utils/email");
const jwt= require("jsonwebtoken");


const generateToken=(id,role)=>{
  return jwt.sign({id,role}, process.env.JWT_SECRET,{expiresIn : '7d'});
}


exports.registeruser=async (req , res, next)=>{
  const {firstname,lastname,email,password}=req.body;
  const userExist=await usermodel.findOne({email});
  if(userExist)
  {
    return res.status(400).json({error: "user Alerady Exist"});
  }

  const salt=await bcrypt.genSalt(10);
  const hashpassword= await bcrypt.hash(password,salt);

  try{
    const user=await usermodel.create({firstname, lastname,email, password : hashpassword, role :'user',isVerfyed: false});
    
    const otp=Math.floor(100000+Math.random()*900000).toString();
    await OtpModel.create({email,otp, action :'account_veryfication'});
    await sendOtpEmail(email,otp,'account_veryfication');
    res.status(201).json({
      message:"user rejestered sussfully. please check your email for otp verify",
      email: user.email,
    });

  }
  catch(error){
    res.status(400).json({error: error.message});
  }

};



exports.loginUser=async (req, res, next)=>{
  const {email, password}=req.body;
  let user=await usermodel.findOne({email});
  if(!user){
    return res.status(400).json({error: `The user Does Not Exitst`});
  }
  const isMatchpassword=await bcrypt.compare(password, user.password);
  if(!isMatchpassword){
    return res.status(400).json({error: `Your Password is Incorrect`});
  }
  if(!user.isVerfyed && user.role==='user')
  {
    const otp=Math.floor(100000+Math.random()*900000).toString();
    await OtpModel.deleteMany({email, action : 'account_veryfication'});
    await OtpModel.create({email, otp,action : 'account_veryfication'});
    await sendOtpEmail(email, otp, 'account_veryfication');
    return res.status(400).json({error: 'Account is not veryficed . A new otp has send you email'});
  }
  
  res.json({
    message:"Login Sussfully",
    _id : user._id,
    name: `${user.firstname} ${user.lastname}`,
    role: user.role,
    email : user.email,
    token:  generateToken(user._id, user.role),
  });
  
};


exports.verifyOtp=async (req, res, next)=>{
  const { email, otp}=req.body;
  const otpRecord=await OtpModel.findOne({email, otp, action : 'account_veryfication'});
  if(!otpRecord){
   return  res.status(400).json({error: "Otp invalid or Expire"})
  }

  const user=await usermodel.findOneAndUpdate({email},{isVerfyed : true});
  await OtpModel.deleteMany({email, action : 'account_veryfication'});
  res.json({
    message: "Account verfied Sussfully. You Can now Login",
    _id: user._id,
    name: `${user.firstname} ${user.lastname}`,
    email : user.email,
    role : user.role,
    token : generateToken(user._id, user.role),
  });


}
