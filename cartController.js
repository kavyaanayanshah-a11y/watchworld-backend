import Cart from "../models/cartModel.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, name, price } = req.body;
    if (!userId || !itemId || !name || !price) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // No cart yet → create new
      cart = new Cart({
        userId,
        items: [{ itemId, name, price, quantity: 1 }]
      });
    } else {
      // Cart exists → update quantity or add new item
      const index = cart.items.findIndex(i => i.itemId === itemId);
      if (index > -1) {
        cart.items[index].quantity += 1;
      } else {
        cart.items.push({ itemId, name, price, quantity: 1 });
      }
    }

    await cart.save(); // save in MongoDB
    res.json({ success: true, message: "Item Added to Cart ✅", cartData: cart.items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update cart quantity
export const updateToCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
    if (!userId || !itemId || quantity == null) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(i => i.itemId === itemId);
    if (index === -1) return res.json({ success: false, message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items.splice(index, 1); // remove
    } else {
      cart.items[index].quantity = quantity;
    }

    await cart.save();
    res.json({ success: true, message: "Cart Updated ✅", cartData: cart.items });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user cart
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

    const cart = await Cart.findOne({ userId });
    res.json({ success: true, cartData: cart ? cart.items : [] });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};