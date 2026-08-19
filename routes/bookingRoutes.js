import express from "express";
import { createBooking, getBookingsByUser } from "../controllers/bookingController.js";

const router = express.Router();

// POST: new booking create and save 
router.post("/", createBooking);

// GET:  user booking fetch
router.get("/", getBookingsByUser);

export default router;