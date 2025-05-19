import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1470&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          padding: "50px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "30px",
            fontWeight: "bold",
            fontFamily: "serif",
            letterSpacing: "1px",
          }}
        >
          Welcome to Book Store
        </h1>
        <motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.96 }}
  onClick={() => navigate("/login")}
  style={{
    padding: "14px 35px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#facc15",
    color: "#000",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  Open
</motion.button>

      </motion.div>
    </div>
  );
};

export default LandingPage;

