import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Placed On:</strong> {format(new Date(order.createdAt), "PPP")}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.book.title} (x{item.quantity})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
