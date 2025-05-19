
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Search, ShoppingCart, BookOpen, Plus } from "lucide-react";

const randomDescriptions = [
  "An engaging tale of mystery and wonder.",
  "A gripping story that will keep you hooked.",
  "A beautiful narrative about love and life.",
  "A thrilling journey through uncharted paths.",
  "A deep dive into the world of imagination.",
  "A fascinating blend of fact and fiction.",
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const navigate = useNavigate();

const fetchBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login");

    const res = await axios.get("http://localhost:5000/books", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedBooks = res.data.map((book) => ({
      ...book,
      description: book.description || randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)]
    }));

    setBooks(updatedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      alert("Failed to fetch books. Please ensure you're logged in.");
    }
  };
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        fetchBooks();
      }
    }, []);

  const deleteBook = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Book deleted successfully.");
      fetchBooks();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete book.");
    }
  };

  const addToCart = async (bookId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/cart",
      { bookId, quantity: 1 },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ this line is critical
        },
      }
    );
    alert("Book added to cart!");
  } catch (error) {
    console.error("Add to cart error:", error.response?.data || error.message);
    alert("Could not add book to cart");
  }
};



  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Book Collection</h1>
        <div style={{ position: "relative", maxWidth: "400px", margin: "0 auto" }}>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 40px 10px 15px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Search
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
              <Pencil
                onClick={() => navigate(`/edit/${book._id}`)}
                style={{ color: "#007bff", cursor: "pointer" }}
              />
              <Trash2
                onClick={() => deleteBook(book._id)}
                style={{ color: "#dc3545", cursor: "pointer" }}
              />
            </div>
            <h3 style={{ marginBottom: "10px" }}>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Description:</strong> {book.description}
            </p>
            <button
  onClick={() => addToCart(book._id)}
  disabled={addingToCart === book._id}
  style={{
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: addingToCart === book._id ? "not-allowed" : "pointer",
    width: "100%",
    fontWeight: "bold",
  }}
>
  {addingToCart === book._id ? "Adding..." : "Add to Cart"}
</button>

          </div>
        ))}
      </div>

      {/* Floating Buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={() => navigate("/orders")}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <BookOpen size={18} /> Orders
        </button>
        <button
          onClick={() => navigate("/cart")}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ShoppingCart size={18} /> Cart
        </button>
        <button
          onClick={() => navigate("/create")}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <Plus size={18} /> Add Book
        </button>
      </div>
    </div>
  );
};

export default Home;

