import express from 'express';
import { listProduct, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';  

const router = express.Router();

// ADD PRODUCT
router.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

// LIST PRODUCT
router.get('/list', listProduct);

// REMOVE PRODUCT
router.post('/remove', adminAuth, removeProduct);

// SINGLE PRODUCT
router.get('/single', singleProduct);

export default router;