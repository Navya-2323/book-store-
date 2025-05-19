import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: ""
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData(res.data);
      } catch (error) {
        console.error("Error loading book:", error);
        alert("Failed to load book details.");
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Book updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" />
        <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none" }}>
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;