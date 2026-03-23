import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

 userId:{
   type:mongoose.Schema.Types.ObjectId,
   required:true,
   ref:"User"
 },

 items:{
   type:Array,
   required:true
 },

 amount:{
   type:Number,
   required:true
 },

 address:{
   type:Object,
   required:true
 },

 paymentMethod:{
   type:String,
   required:true
 },

 status:{
 type:String,
 default:"Placed",
 enum:[
   "Placed",
   "Packing",
   "Shipping",
   "Out For Delivery",
   "Delivered"
 ]
},

 trackingId:{
   type:String,
   default:"Not Generated"
 }

},{timestamps:true});

export default mongoose.model("Order",orderSchema);