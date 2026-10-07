const express=require("express");
const router=express.Router();
const {protect, admin}=require("../middleware/middlewareController");
const {getEventList,getEventById, addEvent, delteEvent,updateEvent}=require("../controller/eventController");

router.get("/",getEventList);
router.get("/:id", getEventById);
router.post("/addEvent", protect, admin, addEvent);
router.post("/delete/:id", protect, admin, delteEvent);
router.put("/update/:id",protect, admin, updateEvent);

module.exports=router;
