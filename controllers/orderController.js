

import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      book: item.book._id,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      paymentMethod,
      isPaid: paymentMethod !== "COD",
      paidAt: paymentMethod !== "COD" ? Date.now() : null,
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};


// Get orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.book");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.book");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
