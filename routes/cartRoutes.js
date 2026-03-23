import express from "express";
import { addToCart, updateToCart, getUserCart } from "../controllers/cartController.js";

const cartRoutes = express.Router();

cartRoutes.post("/add", addToCart);
cartRoutes.post("/update", updateToCart);
cartRoutes.post("/get", getUserCart);

export default cartRoutes;