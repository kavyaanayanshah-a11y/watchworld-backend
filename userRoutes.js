import express from "express";
import { loginUser, registerUser, adminLogin, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Admin login
userRouter.post("/admin", adminLogin);

// Admin fetch all users (React admin panel)
userRouter.get("/all-users", getAllUsers);

export default userRouter;