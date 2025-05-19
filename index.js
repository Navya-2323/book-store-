import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import bookRoutes from "./routes/booksRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Middleware
import authMiddleware  from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Public Routes (no auth required)
app.use("/api/auth", authRoutes);      // login/signup
app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes); // ✅ must match frontend URL
// app.use('/api/cart', cartRoutes); // ✅ Don't add authMiddleware globally here

// Protected Routes (require auth)
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/orders", authMiddleware, orderRoutes);
app.use("/reviews", authMiddleware, reviewRoutes);
app.use("/genres", authMiddleware, genreRoutes);

// Optional: Make book routes also protected
app.use("/books", authMiddleware, bookRoutes); // If all book access requires login

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000; // Default to 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

