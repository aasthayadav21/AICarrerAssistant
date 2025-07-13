// src/pages/ContactUs.js
import React, { useState } from 'react';
import '../App.css';


function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-section-wrapper">
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p>Have questions or feedback? We'd love to hear from you!</p>

      {!submitted ? (
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required />
          <button type="submit">Send</button>
        </form>
      ) : (
        <p className="success-message">✅ Thank you! We’ll get back to you shortly.</p>
      )}
    </div>
    </div>
  );
}

export default ContactUs;
