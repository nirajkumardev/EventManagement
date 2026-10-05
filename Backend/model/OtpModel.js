const { default: mongoose } = require("mongoose");

const otpSchema=new mongoose.Schema({
  email:{
    type: String,
    require: true,
  },
  otp:{
    type: String,
    require : true,
  },
  action:{
    type : String,
    enum :["account_veryfication","event_booking"],
    require: true,
  },
  createdAt:{
    type : Date,
    default: Date.now,
    expires: 300,
  }
});

module.exports=mongoose.model("Otp",otpSchema);