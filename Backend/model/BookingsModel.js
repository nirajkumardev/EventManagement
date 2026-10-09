const mongoose=require("mongoose");

const BookingModel=mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    required: true,
  },
  eventId:{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Event",
  },
  status:{
    type: String,
    enum:['pending','confirmed','cancelled'],
    default: 'pending',
  },
  paymentStatus:{
    type: String,
    enum:['nonpaid','paid'],
    default:'nonpaid',
  },
  amount:{
    type: Number,
    required: true,
  },

},{timestamp : true});

module.exports=mongoose.model("Booking",BookingModel);