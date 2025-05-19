import { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };
const handleCheckout = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/orders",
      { paymentMethod: "COD" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Order placed successfully!");
    fetchCart();
  } catch (err) {
    console.error("Checkout error:", err.response?.data || err.message);
    alert("Checkout failed.");
  }
};




  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Cart</h2>
      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.items.map((item) => (
              <li key={item._id}>
                <strong>{item.book?.title || "Unknown Book"}</strong> - Qty:{" "}
                {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
