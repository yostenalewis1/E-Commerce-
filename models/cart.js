const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
  },
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Cart", cartSchema);