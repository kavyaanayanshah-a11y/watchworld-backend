import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  bestProduct: { type: Boolean, default: false }
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;