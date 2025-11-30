import React, { useState } from 'react';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="page-container">
        <h1>Contact Us</h1>

        <div className="contact-container">
          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />

            <button type="submit" className="btn">Send Message</button>
          </form>

          {/* Company Info */}
          <div className="contact-info">
            <h2>Our Office</h2>
            <p>110 Inner Campus Drive</p>
            <p>Austin, TX 78705</p>
            <p>Email: watchlovers@watchusgo.com</p>
            <p>Phone: +1 123 456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;