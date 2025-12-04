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
    <div className="w-full bg-brandNavy px-12 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>

        <div className="grid grid-cols-2 gap-10 items-start md:gap-8">
          {/* Contact Form */}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="text-white font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 border-opacity-20 bg-white bg-opacity-5 text-white text-sm outline-none placeholder-gray-500 placeholder-opacity-60"
              placeholder="Your name"
            />

            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 border-opacity-20 bg-white bg-opacity-5 text-white text-sm outline-none placeholder-gray-500 placeholder-opacity-60"
              placeholder="Your email"
            />

            <label className="text-white font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 border-opacity-20 bg-white bg-opacity-5 text-white text-sm outline-none placeholder-gray-500 placeholder-opacity-60 resize-vertical"
              placeholder="Your message"
            />

            <button type="submit" className="btn self-start">Send Message</button>
          </form>

          {/* Company Info */}
          <div className="bg-white bg-opacity-5 p-5 rounded-lg text-white">
            <h2 className="text-2xl font-bold mb-4">Our Office</h2>
            <p className="mb-2">110 Inner Campus Drive</p>
            <p className="mb-2">Austin, TX 78705</p>
            <p className="mb-2">Email: watchlovers@watchusgo.com</p>
            <p>Phone: +1 123 456 7890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;