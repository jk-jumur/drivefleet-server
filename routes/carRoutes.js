import express from "express";

import {
  addCar,
  getAllCars,
  getCarById,
  getMyAddedCars,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { verifyOwner } from "../middleware/verifyOwner.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all cars
router.get("/", getAllCars);

// Get single car
router.get("/:id", getCarById);


// =====================================================
// PRIVATE ROUTES
// =====================================================

// My added cars
// IMPORTANT: Must come before /:id
router.get(
  "/my-added-cars",
  verifyToken,
  getMyAddedCars
);

// Add new car
router.post(
  "/",
  verifyToken,
  addCar
);


// =====================================================
// OWNER ONLY ROUTES
// =====================================================

// Update car
router.put(
  "/:id",
  verifyToken,
  verifyOwner,
  updateCar
);

// Delete car
router.delete(
  "/:id",
  verifyToken,
  verifyOwner,
  deleteCar
);

export default router;