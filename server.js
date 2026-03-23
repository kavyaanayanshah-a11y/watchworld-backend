// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";

import userRouter from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewsRouter from "./routes/reviews.js"; // <-- Import reviews

const app = express();
const port = process.env.PORT || 4000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewsRouter); // <-- Add reviews route

// Test Route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});