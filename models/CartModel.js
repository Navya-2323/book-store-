import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;



















