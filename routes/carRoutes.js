import express from "express";

import {
  addCar,
  getAllCars,
  getCarById,
  getMyAddedCars,
  deleteCar,
} from "../controllers/carController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCars);
router.get("/my-added-cars", getMyAddedCars); // user added car
router.get("/:id", getCarById); 

// Private routes
router.post("/", addCar);
router.delete("/:id", deleteCar); // delete car route

export default router;