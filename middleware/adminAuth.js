import jwt from "jsonwebtoken";

const adminAuth = async (req,res,next)=>{

 try{

   const authHeader = req.headers.authorization;

   if(!authHeader){
     return res.json({
       success:false,
       message:"Unauthorized User"
     });
   }

   const token = authHeader.split(" ")[1];

   const decoded = jwt.verify(token, process.env.JWT_SECRET);

   if(decoded.email !== process.env.ADMIN_EMAIL){
     return res.json({
       success:false,
       message:"User not authorized"
     });
   }

   next();

 }catch(error){
   res.json({
     success:false,
     message:error.message
   });
 }

};

export default adminAuth;