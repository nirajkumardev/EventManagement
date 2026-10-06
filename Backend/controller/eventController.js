const Eventmoudle=require("../model/EventModel");
const { events } = require("../model/OtpModel");

exports.getEventList= async(req, res, next)=>{
  try{
    let filter={};
    if(req.query.category){
      filter.category=req.query.category;
    };
    if(req.query.serch){
      filter.title=filters.title = { $regex: req.query.search, $options: 'i' };
    }
    const event=await Eventmoudle.find(filter).populate('createdBy', 'firstname lastname email');

    res.json(event);
  }
  catch(error){
    res.status(500).json({message: "No any Event Avlable" ,error: error.message});
  }
};



exports.getEventById= async ( req, res, next)=>{
  try{
    const event=await Eventmoudle.findById(req.params.id).populate('createdBy', 'firstname lastname email');
    if(!event){
      return res.status(404).json({message: "No any Event Exist"});
    }
    res.json(event);
  }
  catch(error){
    res.status(500).json({message:"Server Error",error: error.message});
  };
};




exports.addEvent=async (req, res,next)=>{
  try {
    const {title, description,date,time,location,image,category,totalSeats,price,createdBy}=req.body;
  const createdEvent=await Eventmoudle.create({
    title,
    description,
    date,
    time,
    location,
    category,
    totalSeats,
    image : image || "",
    availableSeats: totalSeats,
    price : price || 0,
    createdBy : req.user.id,

  });
  res.status(201).json(createdEvent);
  }
  catch(error){
    res.status(500).json({message: 'server Error', })
  };
   
};



exports.delteEvent=async (req, res, next)=>{
  try{
    const Deltevalue=await Eventmoudle.findByIdAndDelete(req.params.id);
    if(!Deltevalue){
      return res.status(404).json({message: "No Any Event Exist"});
    }
    res.json({message: "Event Deleted Sussfully"});
  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message});
  };
};


exports.updateEvent=async (req, res, next)=>{
  try{
    const event= await Eventmoudle.findByIdAndUpdate(req.params.id, req.body, {new : true});
    if(!event){
      return res.status(404).json({message: "No any Event Found"});
    }
    res.json(event);
  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message});
  };
};

