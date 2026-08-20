import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export const verifyOwner = async (req, res, next) => {
  try {
    // Get car ID from URL params
    const { id: carId } = req.params;

    // Get authenticated user's email from verified JWT
    const userEmail = req.user?.email?.trim().toLowerCase();

    // Check authenticated user
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
        message: "Invalid car ID format.",
      });
    }

    const db = getDB();

    // Find car
    const car = await db.collection("cars").findOne({
      _id: new ObjectId(carId),
    });

    // Car doesn't exist
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found.",
      });
    }

    // Get owner's email from database
    const ownerEmail = car.ownerEmail?.trim().toLowerCase();

    // Check ownership
    if (!ownerEmail || ownerEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not the owner of this car.",
      });
    }

    // Owner verified successfully
    next();
  } catch (error) {
    console.error("Verify owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during owner verification.",
    });
  }
};