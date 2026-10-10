const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// External Module
const express = require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require("mongoose");

// local module
const authRoutes=require("./routes/authroutes");
const EventRoute=require("./routes/eventRoute");
const BookingRoute=require("./routes/bookingroutes");


dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

// Routes 
app.use('/api/auth',authRoutes);
app.use('/api/event', EventRoute);
app.use('/api/booking',BookingRoute);


mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
  console.log("The Data base Connceted Sussfully");
}).catch((error)=>{
  console.log("The Data Base Error come", error);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`The server is running on http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
    console.log("SERVER ERROR:", error);
});