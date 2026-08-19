import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import createCarDocument from "../models/carModel.js";

// Add a new car
export const addCar = async (req, res) => {
  try {
    const {
      carName,
      dailyRentPrice,
      carType,
      image,
      seatCapacity,
      pickupLocation,
      description,
      availabilityStatus,
    } = req.body;

    if (
      !carName ||
      !dailyRentPrice ||
      !carType ||
      !image ||
      !seatCapacity ||
      !pickupLocation ||
      !description ||
      !availabilityStatus
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required car information.",
      });
    }

    const carData = createCarDocument({
      carName,
      dailyRentPrice,
      carType,
      image,
      seatCapacity,
      pickupLocation,
      description,
      availabilityStatus,
     ownerName: "DriveFleet User",
     ownerEmail: "user@drivefleet.com",
    });

    const db = getDB();

    const result = await db.collection("cars").insertOne(carData);

    res.status(201).json({
      success: true,
      message: "Car added successfully.",
      car: {
        _id: result.insertedId,
        ...carData,
      },
    });
  } catch (error) {
    console.error("Add car error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add car.",
    });
  }
};


// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const db = getDB();

    const cars = await db
      .collection("cars")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error("Get cars error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cars.",
    });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID format.",
      });
    }

    const db = getDB();
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    console.error("Get car by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch car details.",
    });
  }
};