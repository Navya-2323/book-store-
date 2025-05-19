import Cart from "../models/CartModel.js";
import Order from "../models/OrderModel.js";

export const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user?._id;  // Comes from authMiddleware
  if (!userId) {
    // console.error("No user ID found in request");
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ book: bookId, quantity }] });
    } else {
      const index = cart.items.findIndex(item => item.book.toString() === bookId);
      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity });
      }
    }
    await cart.save();
    const populatedCart = await Cart.findOne({ user: userId }).populate("items.book");
    res.status(200).json(populatedCart);
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.book.toString() !== req.params.bookId);
    await cart.save();

    res.status(200).json({ message: "Removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map(item => ({
      book: item.book._id,
      quantity: item.quantity
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      paymentMethod,
      isPaid: paymentMethod !== "COD",
      paidAt: paymentMethod !== "COD" ? Date.now() : null,
    });

    await newOrder.save();
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.book");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
