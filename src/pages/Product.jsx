import React from 'react';
import axios from 'axios';

const Product = ({ product }) => {
  const addToCart = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: 'user-id', // Replace with actual user ID
        productId: product._id,
        quantity: 1,
      });
      alert(response.data.message);
    } catch (err) {
      alert(err.response.data.message || 'Server error');
    }
  };

  return (
    <div>
      <h2>{product.title}</h2>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default Product;
