import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import createBookingDocument from "../models/bookingModel.js";

// ১. new book create and save controller
export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      userEmail,
      carName,
      image,
      totalPrice,
      driverNeeded,
      specialNote,
    } = req.body;

    // validation check
    if (!carId || !userEmail || !carName || !totalPrice || !driverNeeded) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking information.",
      });
    }

    // model function booking model create
    const bookingData = createBookingDocument({
      carId,
      userEmail,
      carName,
      image,
      totalPrice,
      driverNeeded,
      specialNote,
    });

    const db = getDB();

    // booking collection insert 
    const result = await db.collection("bookings").insertOne(bookingData);

   
    if (ObjectId.isValid(carId)) {
      await db.collection("cars").updateOne(
        { _id: new ObjectId(carId) },
        { $inc: { bookingCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Car booked successfully.",
      booking: {
        _id: result.insertedId,
        ...bookingData,
      },
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book the car.",
    });
  }
};

// 1.user booking controller
export const getBookingsByUser = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const query = userEmail ? { userEmail } : {};

    const db = getDB();
    const bookings = await db
      .collection("bookings")
      .find(query)
      .toArray();

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
};