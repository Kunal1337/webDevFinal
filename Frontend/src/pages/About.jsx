import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About WatchStore</h1>
        <p>We craft and deliver premium watches worldwide.</p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At WatchStore, our mission is to provide timeless watches that combine style, quality, and precision. 
          Every timepiece is carefully selected to ensure our customers get nothing but the best.
        </p>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <ul>
          <li>🕰 Quality craftsmanship</li>
          <li>🌍 Global delivery</li>
          <li>💎 Premium customer service</li>
          <li>⌚ Style meets functionality</li>
        </ul>
      </section>

      <section className="about-team">
        <h2>Our Team</h2>
        <p>
          Our passionate team of watch enthusiasts, designers, and customer service experts work together 
          to bring you an unforgettable shopping experience.
        </p>
      </section>
    </div>
  );
};

export default About;
