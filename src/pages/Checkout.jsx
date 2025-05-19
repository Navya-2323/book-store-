import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your-stripe-publishable-key'); // Replace with your actual Stripe publishable key

const Checkout = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { name: 'Book Title', price: 20, quantity: 1 },
          // Add more items as needed
        ],
      }),
    });
    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
  };

  return <button onClick={handleCheckout}>Proceed to Payment</button>;
};

export default Checkout;
