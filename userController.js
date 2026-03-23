import validator from "validator";
import userModel from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
    try {
        const {email, password } = req.body;

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true, message: "Login Successful" , token})
        }
        else{
            res.json({success:false, message:"Incorrect password entered"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
};

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.json({
                success:false,
                message:"Invalid email address"
            });
        }

        // Password validation
        if (password.length < 8) {
            return res.json({
                success:false,
                message:"Password must be at least 8 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        res.json({
            success:true,
            message:"Account Created Successfully",
            token
        });

    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trim for safety
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminPassword = process.env.ADMIN_PASSWORD?.trim();

        if (
            email.trim() === adminEmail &&
            password.trim() === adminPassword
        ) {
            const token = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.json({ success: true, token });
        }

        return res.json({ success: false, message: "Invalid details" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// -------------------- Admin: Get All Users --------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "name email code");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { loginUser, registerUser, adminLogin, getAllUsers };