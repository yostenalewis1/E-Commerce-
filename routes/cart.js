//cart.js
const mongoose = require("mongoose");
const router = require('express').Router();
const Cart = require('../models/cart');
const Product = require("../models/Product");
const User = require("../models/user");
  
 
 

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");

// Add to cart
router.post("/", verifyToken, async (req, res) => {
  const { userId, productId } = req.body;

  try {

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const product = await Product.findById(productId)
    if(!product)
    {
      return res.status(404).json({message:"product not found"})
    }

    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
  //////////////////// /////////////////////////verifyorder

  router.post("/verify-order", verifyToken, async (req, res) => {
    const { userId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const cart = await Cart.findOne({ userId }).populate("productId");
      if (!cart || cart.length === 0) {
        return res.status(404).json({ message: "Cart not found or empty" });
      }
      await Cart.findOneAndDelete({ userId }); // Remove the user's cart
      res.status(200).json({ user, cart });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  ////////////////////////////////////////////////// Cancel the order
  router.post('/cancel-order', verifyToken, async (req, res) => {
    const { userId } = req.body;
  
    try {
      await Cart.findOneAndDelete({ userId });
   
      res.status(200).json({ message: 'Order has been canceled' });
     
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports= router