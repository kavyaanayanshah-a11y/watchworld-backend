import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeCheckout = async (req, res) => {
  try {
    const { cartItems, userId, shippingAddress } = req.body;

    // 1. Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // 2. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Stripe expects cents
        },
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // 3. Save order in MongoDB
    const order = new Order({
      user: userId,
      items: cartItems,
      amount: totalAmount,
      status: "Pending",
    });
    await order.save();

    // 4. Return session URL to frontend
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =============================
   ⭐ PLACE ORDER
============================= */
export const placeOrder = async (req,res)=>{
    try{

        const userId = req.user.id;

        const { items, amount, address, paymentMethod } = req.body;

        const order = new Order({
            userId,
            items,
            amount,
            address,
            paymentMethod,
            status:"Placed"
        });

        await order.save();

        res.json({
            success:true,
            message:"Order placed successfully"
        });

    }catch(error){
        res.json({
            success:false,
            message:error.message
        });
    }
};


/* =============================
   ⭐ GET USER ORDERS (My Orders)
============================= */
export const userOrders = async(req,res)=>{

    try{

        const userId = req.user.id;

        const orders = await Order.find({ userId }).sort({ createdAt:-1 });

        res.json({
            success:true,
            orders
        });

    }catch(error){
        res.json({
            success:false,
            message:error.message
        });
    }

};

/* =============================
   ⭐ ADMIN - ALL ORDERS
============================= */
export const allOrder = async(req,res)=>{
    try{

        const orders = await Order.find({}).sort({ createdAt:-1 });

        res.json({
            success:true,
            orders
        });

    }catch(error){
        res.json({
            success:false,
            message:error.message
        });
    }
};


/* =============================
   ⭐ UPDATE ORDER STATUS
============================= */
export const updateStatus = async(req,res)=>{

 try{

   const {orderId,status} = req.body;

   await Order.findByIdAndUpdate(orderId,{
     status
   });

   res.json({
     success:true,
     message:"Status Updated"
   });

 }catch(error){
   res.json({
     success:false,
     message:error.message
   });
 }

};