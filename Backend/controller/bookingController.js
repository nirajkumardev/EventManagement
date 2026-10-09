const BookingModel = require("../model/BookingsModel");
const OtpModel = require("../model/OtpModel");
const EventModel = require("../model/EventModel");
const { sendOtpEmail, sendBookingEmail } = require("../utils/email");
const generatotp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendotp = async (req, res, next) => {
  try {
    const otp = generatotp();
    await OtpModel.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });
    await OtpModel.create({
      email: req.user.email,
      otp: otp,
      action: "event_booking",
    });
    await sendOtpEmail(req.user.email, otp, "event_booking");
    res.json({ message: "Your Otp Send Sussfully" });
  } catch (error) {
    res.json({ message: "Server Error", error: error.message });
  }
};

exports.bookingEvent = async (req, res, next) => {
  try {
    const { eventId, otp } = req.body;
    const validateOtp = await OtpModel.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });
    if (!validateOtp) {
      return res
        .status(400)
        .json({ message: "Your Otp Has been Expire or Invalide" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(400).json({ message: "Evnent Does Not Exist" });
    }
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "Seate Are Not Available" });
    }

    const alreadyBooking = await BookingModel.findOne({
      userId: req.user.id,
      eventId,
    });
    if (alreadyBooking && alreadyBooking.status !== "cancelled") {
      return res.status(400).json({ message: "You Already Book This Evnet " });
    }

    const booking = await BookingModel.create({
      userId: req.user.id,
      eventId,
      status: "pending",
      paymentStatus: "nonpaid",
      // ther is doute
      amount: event.price,
    });

    await OtpModel.deleteOne({ _id: validateOtp._id });
    res.status(201).json({ message: "Event booking reques", booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({
      message: "your Event is not Book Server Error",
      error: error.message,
    });
  }
};

exports.confirmEvent = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await BookingModel.findById(req.params.id)
      .populate("userId")
      .populate("eventId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not Found" });
    }

    if (!booking.eventId) {
      return res.status(404).json({ message: "Event not Found" });
    }

    if (!booking.userId) {
      return res.status(404).json({ message: "User not Found" });
    }
    if (booking.status === "confirmed") {
      return res.status(400).json({ message: "Booking is Already confirmed" });
    }

    const event = await EventModel.findById(booking.eventId._id);
    if(!event)
    {
      return res.status(400).json({message: "Event not Found"});
    }
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "No Seat Are Available" });
    }

    booking.status = "confirmed";
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    event.availableSeats -= 1;
    await event.save();

    await sendBookingEmail(
      booking.userId.email,
      booking.userId.firstname,
      booking.eventId.title,
      booking.eventId.date,
      booking.eventId.time,
      booking.eventId.location,
      booking.id,
    );

    res.status(200).json({ message: "your Booking is Confirmed", booking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "server Error Not Booking", error: error.message });
  }
};

exports.DeletemyEvent = async (req, res, next) => {
  try {
    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking Not Found" });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unathorized" });
    }

    if (booking.status === "cancelled")
    {
      await BookingModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: "Cancelled booking deleted successfully"});
    }

    const wasconfirm = booking.status === "confirmed";

    if (wasconfirm) {
      const event = await EventModel.findById(booking.eventId);
      if (event) {
        event.availableSeats += 1;
        await event.save();
      }
    }
    booking.status="cancelled"
    await booking.save();
    return res.status(200).json({
  message: "Booking Cancelled Successfully",
  booking,});
  } catch (error) {
      console.error("CANCEL BOOKING ERROR:", error);

  return res.status(500).json({
    message: "Failed to Cancel Booking",
    error: error.message, });
  }
};

exports.myBooking = async (req, res, next) => {
  try {
    const bookings =
      req.user.role === "admin"
        ? await BookingModel.find()
            .populate("eventId")
            .populate("userId", "firstname email")
            .sort({ createdAt: -1 })
        : await BookingModel.find({ userId: req.user.id })
            .populate("eventId")
            .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
