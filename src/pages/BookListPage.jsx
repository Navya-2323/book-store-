import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddToCart = async (bookId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to cart.");
      return;
    }

    const res = await axios.post(
  "http://localhost:5000/api/cart",
  { bookId, quantity: 1 },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


    alert(`✅ Added to cart: ${res.data.items.length} items total.`);
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data || error.message);
    alert("Failed to add book to cart.");
  }
};


  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>Book Collection</h2>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filteredBooks.map((book) => (
  <div
    key={book._id}
    style={{
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
    {/* Edit/Delete Icons */}
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        display: "flex",
        gap: "10px",
      }}
    >
      <FaEdit
        style={{ color: "#007bff", cursor: "pointer" }}
        title="Edit"
        onClick={() => navigate(`/edit/${book._id}`)}
      />
      <FaTrash
        style={{ color: "#dc3545", cursor: "pointer" }}
        title="Delete"
        onClick={() => handleDelete(book._id)}
      />
    </div>

    {/* Horizontal layout */}
    <div style={{ flex: "1", minWidth: "150px" }}>
      <p><strong>Title:</strong><br />{book.title}</p>
    </div>

    <div style={{ flex: "1", minWidth: "120px" }}>
      <p><strong>Author:</strong><br />{book.author}</p>
    </div>

    <div style={{ flex: "1", minWidth: "100px" }}>
      <p><strong>Year:</strong><br />{book.year}</p>
    </div>

    <div style={{ flex: "2", minWidth: "250px" }}>
      <p><strong>Description:</strong><br />{book.description || "No description available."}</p>
    </div>

    <div style={{ minWidth: "160px" }}>
      <button
        onClick={() => handleAddToCart(book._id)}
        style={{
          padding: "10px 16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  </div>
))}
      </div>
    </div>
  );
};

export default BookListPage;



