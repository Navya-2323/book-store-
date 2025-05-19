import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data.items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
      alert("Unable to load cart. Please log in again.");
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/orders",
        { paymentMethod: "COD" }, // or another method if needed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order placed successfully!");
      navigate("/home");
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order failed.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: "#f9fafb" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart. Go add some!</p>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{item.book.title}</h3>
                <p><strong>Author:</strong> {item.book.author}</p>
                <p><strong>Year:</strong> {item.book.year}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.book._id)}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={placeOrder}
            style={{
              marginTop: "2rem",
              padding: "12px 20px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
