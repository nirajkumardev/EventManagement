const jwt=require("jsonwebtoken");
const userModel=require("../model/userModel");


exports.protect=async (req, res , next)=>{
  let token=req.headers.authorization;
  if(token && token.startsWith('Bearer'))
  {
    try{
      token=token.split(' ')[1];
      const decode=jwt.verify(token,process.env.JWT_SECRET);
      req.user= await userModel.findById(decode.id).select('-password');
      if(!req.user)
      {
        return res.status(401).json({message: "Not authorized, user Not Found"});
      }
      next();
    }
    catch(error){
      res.staut(401).json({message: "Your are Not Authorized"});
    }
  }
  else{
    res.status(401).json({message: "Not Authorized "});
  };
};


exports.admin=(req, res, next)=>{
  if(req.user && req.user.role==="admin"){
    next();
  }
  else{
    res.status(401).json({message: "Your are not As a Admin authorized"});
  };
};





