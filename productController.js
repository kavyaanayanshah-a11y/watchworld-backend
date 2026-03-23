// controllers/productController.js
import Product from "../models/productModel.js";

// ================= ADD PRODUCT =================
const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.files) {
      return res.json({
        success: false,
        message: "Images not uploaded",
      });
    }

    // Get Images
    const image1 = req.files?.image1?.[0]?.filename || "";
    const image2 = req.files?.image2?.[0]?.filename || "";
    const image3 = req.files?.image3?.[0]?.filename || "";
    const image4 = req.files?.image4?.[0]?.filename || "";

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.json({
        success: false,
        message: "Please select images",
      });
    }

    // Get Form Data
    const { name, price, category, description } = req.body;

    const product = new Product({
      name,
      price,
      category,
      desc: description,
      image: images,
    });

    await product.save();

    // Map image filenames to full URLs
    const productWithUrls = {
      ...product._doc,
      image: product.image.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      ),
    };

    res.json({
      success: true,
      message: "Product added successfully",
      product: productWithUrls,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LIST PRODUCT =================
const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});

    // Convert image filenames to full URLs
    const productsWithUrls = products.map((p) => ({
      ...p._doc,
      image: p.image.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      ),
    }));

    res.json({
      success: true,
      products: productsWithUrls,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REMOVE PRODUCT =================
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ================= SINGLE PRODUCT =================
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Map images to full URLs
    const productWithUrls = {
      ...product._doc,
      image: product.image.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      ),
    };

    res.json({ success: true, product: productWithUrls });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };