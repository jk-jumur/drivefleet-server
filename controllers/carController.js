import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
import createCarDocument from "../models/carModel.js";

// =====================================================
// 1. ADD NEW CAR
// =====================================================

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

    // Check authenticated user
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found.",
      });
    }

    // Validate required fields
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

    // IMPORTANT:
    // owner information comes from JWT.
    // Do NOT trust frontend ownerEmail/ownerName.
    const carData = createCarDocument({
      carName,
      dailyRentPrice,
      carType,
      image,
      seatCapacity,
      pickupLocation,
      description,
      availabilityStatus,

      ownerName: req.user.name || "DriveFleet User",
      ownerEmail: req.user.email,
    });

    const db = getDB();

    const result = await db
      .collection("cars")
      .insertOne(carData);

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

// =====================================================
// 2. GET ALL CARS - PUBLIC
// =====================================================

export const getAllCars = async (req, res) => {
  try {
    const db = getDB();

    const { search, type } = req.query;

    let query = {};

    // Search by car name
    if (search) {
      query.carName = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by car type
    if (type) {
      query.carType = type;
    }

    const cars = await db
      .collection("cars")
      .find(query)
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

// =====================================================
// 3. GET SINGLE CAR - PUBLIC
// =====================================================

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

    const car = await db
      .collection("cars")
      .findOne({
        _id: new ObjectId(id),
      });

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

// =====================================================
// 4. GET MY ADDED CARS - PRIVATE
// =====================================================

export const getMyAddedCars = async (req, res) => {
  try {

     
    // Get email from verified JWT
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found.",
      });
    }

    const db = getDB();

    const cars = await db
      .collection("cars")
      .find({
        ownerEmail: userEmail,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error(
      "Get my added cars error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch your added cars.",
    });
  }
};

// =====================================================
// 5. UPDATE CAR - PRIVATE
// =====================================================

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID format.",
      });
    }

    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found.",
      });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Never allow frontend to change ownership
    delete updatedData.ownerEmail;
    delete updatedData.ownerName;
    delete updatedData._id;

    const db = getDB();

    const result = await db
      .collection("cars")
      .updateOne(
        {
          _id: new ObjectId(id),
          ownerEmail: req.user.email,
        },
        {
          $set: updatedData,
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Car not found or you are not the owner.",
      });
    }

    // Get the updated car document
    const updatedCar = await db
      .collection("cars")
      .findOne({
        _id: new ObjectId(id),
        ownerEmail: req.user.email,
      });

    res.status(200).json({
      success: true,
      message: "Car updated successfully.",
      car: updatedCar,
    });
  } catch (error) {
    console.error(
      "Update car error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update car.",
    });
  }
};


// =====================================================
// 6. DELETE CAR - PRIVATE
// =====================================================

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID format.",
      });
    }

    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information not found.",
      });
    }

    const db = getDB();

    const result = await db
      .collection("cars")
      .deleteOne({
        _id: new ObjectId(id),
        ownerEmail: req.user.email,
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Car not found or you are not the owner.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car deleted successfully.",
      result,
    });
  } catch (error) {
    console.error(
      "Delete car error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete car.",
    });
  }
};