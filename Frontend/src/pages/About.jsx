import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Watch US Go</h1>
        <p>We craft and deliver premium U.S watches worldwide.</p>
      </section>
      <br></br>

      <div className="about-sections">
        <div className="section-card">
          <div className="card-icon">⏱️</div>
          <h3>Our Mission</h3>
          <p>
            At Watch US Go, our mission is to provide timeless watches that combine style, quality, and precision. 
            Every timepiece is carefully selected to ensure our customers get nothing but the best.
          </p>
          <div className="card-meta">Timeless design • Global delivery</div>
        </div>

        <div className="section-card">
          <div className="card-icon">🏆</div>
          <h3>Our Values</h3>
          <p>
            We prioritize quality craftsmanship, exceptional customer service, and responsible practices
            so our customers always receive value and trust in every purchase.
          </p>
          <ul>
            <li>Quality craftsmanship</li>
            <li>Global delivery</li>
            <li>Premium customer service</li>
            <li>Style meets functionality</li>
          </ul>
        </div>

        <div className="section-card">
          <div className="card-icon">👥</div>
          <h3>Our Team</h3>
          <p>
            Our passionate team of watch enthusiasts, designers, and customer service experts work together 
            to bring you an unforgettable shopping experience for watch lovers like you.
          </p>
          <div className="card-meta">Small team • Big passion</div>
        </div>
      </div>
    </div>
  );
};

export default About;
