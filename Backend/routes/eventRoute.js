const express=require("express");
const router=express.Router();
const {protect, admin}=require("../middleware/middlewareController");
const {getEventList,getEventById, addEvent, delteEvent,updateEvent,rejectEvent}=require("../controller/eventController");

router.get("/",getEventList);
router.get("/:id", getEventById);
router.post("/addEvent", protect, admin, addEvent);
router.delete("/delete/:id", protect, admin, delteEvent);
router.put("/update/:id",protect, admin, updateEvent);
router.delete("/reject/:id", protect, admin, rejectEvent);

module.exports=router;
