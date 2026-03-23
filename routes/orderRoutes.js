import express from "express";
import authUser from "../middleware/auth.js";
import {
    placeOrder,
    userOrders,
    allOrder,
    updateStatus,
    stripeCheckout
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.get("/user", authUser, userOrders);
orderRouter.get("/list", adminAuth, allOrder);
orderRouter.post("/status", authUser, updateStatus);
orderRouter.post("/stripe-checkout", stripeCheckout);

export default orderRouter;