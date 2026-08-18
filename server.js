import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/db.js";
import carRoutes from "./routes/carRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("DriveFleet server is running");
});

// Car routes
app.use("/api/cars", carRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`DriveFleet server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();