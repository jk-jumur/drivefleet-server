import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import createBookingDocument from "../models/bookingModel.js";

// =====================================================
// 1. CREATE BOOKING
// =====================================================

export const createBooking = async (req, res) => {
  try {
    const {
      carId,
      driverNeeded,
      specialNote,
    } = req.body;

    // Get authenticated user from JWT
    const userEmail = req.user?.email;
    const userName = req.user?.name;

    // Authentication check
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found.",
      });
    }

    // Validate car ID
    if (!carId || !ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Valid car ID is required.",
      });
    }

    // Validate driver selection
    if (typeof driverNeeded !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Please select whether a driver is needed.",
      });
    }

    const db = getDB();

    // =================================================
    // Find actual car from database
    // =================================================

    const car = await db.collection("cars").findOne({
      _id: new ObjectId(carId),
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    // =================================================
    // Check availability
    // =================================================

    if (car.availabilityStatus !== "Available") {
      return res.status(400).json({
        success: false,
        message: "This car is currently unavailable.",
      });
    }

    // =================================================
    // Create booking
    // =================================================

    const bookingData = createBookingDocument({
      carId: car._id.toString(),

      // User information comes from JWT
      userName: userName || "DriveFleet User",
      userEmail,

      // Car information comes from MongoDB
      carName: car.carName,
      image: car.image,
      dailyRentPrice: car.dailyRentPrice,

      driverNeeded,
      specialNote,
    });

    // =================================================
    // Insert booking
    // =================================================

    const result = await db
      .collection("bookings")
      .insertOne(bookingData);

    // =================================================
    // Increase booking count
    // =================================================

    await db.collection("cars").updateOne(
      {
        _id: new ObjectId(carId),
      },
      {
        $inc: {
          bookingCount: 1,
        },
      }
    );

    // =================================================
    // Response
    // =================================================

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


// =====================================================
// 2. GET MY BOOKINGS
// =====================================================

export const getBookingsByUser = async (req, res) => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found.",
      });
    }

    const db = getDB();

    const bookings = await db
      .collection("bookings")
      .find({
        userEmail: userEmail.toLowerCase(),
      })
      .sort({
        bookingDate: -1,
      })
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


// =====================================================
// 3. GET SINGLE BOOKING
// =====================================================

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const db = getDB();

    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
      userEmail: userEmail.toLowerCase(),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error("Get booking by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking.",
    });
  }
};