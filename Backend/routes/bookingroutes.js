const express=require("express");
const router=express.Router();
const {protect, admin}=require("../middleware/middlewareController");
const {getEventList,getEventById, addEvent, delteEvent,updateEvent}=require("../controller/eventController");
const {bookingEvent, sendotp, confirmEvent, DeletemyEvent, myBooking}=require("../controller/bookingController");


router.post("/booking",protect,bookingEvent);
router.post("/sendotp",protect,sendotp);
router.put("/:id/confirm",  protect,  admin, confirmEvent);
router.delete("/:id",protect, DeletemyEvent);
router.get("/my",protect, myBooking);


module.exports=router;