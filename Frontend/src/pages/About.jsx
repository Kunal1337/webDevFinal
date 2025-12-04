import React from 'react';

const About = () => {
  return (
    <div className="w-full bg-brandNavy px-12 py-6">
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">About Watch US Go</h1>
          <p className="text-lg text-gray-300">We craft and deliver premium U.S watches worldwide.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-blue-900">
            <div className="w-14 h-14 rounded-lg bg-blue-300 bg-opacity-20 inline-flex items-center justify-center text-2xl mb-3">⏱️</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-900">Our Mission</h3>
            <p className="text-blue-800 leading-relaxed">
              At Watch US Go, our mission is to provide timeless watches that combine style, quality, and precision. 
              Every timepiece is carefully selected to ensure our customers get nothing but the best.
            </p>
            <div className="mt-3 text-sm text-blue-700">Timeless design • Global delivery</div>
          </div>

          <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-blue-900">
            <div className="w-14 h-14 rounded-lg bg-blue-300 bg-opacity-20 inline-flex items-center justify-center text-2xl mb-3">🏆</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-900">Our Values</h3>
            <p className="text-blue-800 leading-relaxed">
              We prioritize quality craftsmanship, exceptional customer service, and responsible practices
              so our customers always receive value and trust in every purchase.
            </p>
            <ul className="list-disc list-inside mt-3 text-sm text-blue-700">
              <li>Quality craftsmanship</li>
              <li>Global delivery</li>
              <li>Premium customer service</li>
              <li>Style meets functionality</li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-b from-blue-100 to-blue-200 border border-blue-200 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-blue-900">
            <div className="w-14 h-14 rounded-lg bg-blue-300 bg-opacity-20 inline-flex items-center justify-center text-2xl mb-3">👥</div>
            <h3 className="text-2xl font-bold mb-3 text-blue-900">Our Team</h3>
            <p className="text-blue-800 leading-relaxed">
              Our passionate team of watch enthusiasts, designers, and customer service experts work together 
              to bring you an unforgettable shopping experience for watch lovers like you.
            </p>
            <div className="mt-3 text-sm text-blue-700">Small team • Big passion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;