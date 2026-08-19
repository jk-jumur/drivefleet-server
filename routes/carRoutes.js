import express from "express";

import {
  addCar,
  getAllCars,
  getCarById,
} from "../controllers/carController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/:id", getCarById); 

// Temporary private route
router.post("/", addCar);

export default router;