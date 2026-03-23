import mongoose from "mongoose";

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Connected ✅");

    } catch (error) {
        console.log("MongoDB Connection Failed ❌");
        console.log(error);

        process.exit(1); // Stop server if DB fails
    }
};

export default connectDB;