import express from "express";

import {
  addCar,
  getAllCars,
} from "../controllers/carController.js";

const router = express.Router();

// Public route
router.get("/", getAllCars);

// Temporary private route
router.post("/", addCar);

export default router;