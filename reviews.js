// routes/reviews.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ----- 1. Review Schema -----
const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },  // Product ID
  name: { type: String, required: true },      // Reviewer Name
  rating: { type: Number, required: true },    // 1-5 stars
  title: { type: String },                     // Optional title
  text: { type: String, required: true },      // Review content
  date: { type: Date, default: Date.now },     // Auto timestamp
});

const Review = mongoose.model("Review", reviewSchema);

// ----- 2. GET Reviews for a Product -----
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- 3. POST a New Review -----
router.post("/", async (req, res) => {
  const { productId, name, rating, title, text } = req.body;

  if (!productId || !name || !rating || !text) {
    return res.status(400).json({ error: "Please provide productId, name, rating, and text" });
  }

  try {
    const newReview = new Review({ productId, name, rating, title, text });
    await newReview.save();
    res.json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;