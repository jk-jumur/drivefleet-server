import express from "express";

import {
  createBooking,
  getBookingsByUser,
  getBookingById,
} from "../controllers/bookingController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


// Create booking
router.post(
  "/",
  verifyToken,
  createBooking
);


// Get logged-in user's bookings
router.get(
  "/",
  verifyToken,
  getBookingsByUser
);


// Get single booking
router.get(
  "/:id",
  verifyToken,
  getBookingById
);


export default router;