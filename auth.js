import jwt from "jsonwebtoken";

const authUser = async (req,res,next)=>{

    try{

        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.json({
                success:false,
                message:"Login first"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ⭐ IMPORTANT
        req.user = decoded;

        next();

    }catch(error){
        res.json({
            success:false,
            message:"Auth Failed"
        });
    }

};

export default authUser;