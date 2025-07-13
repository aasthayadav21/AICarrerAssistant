// src/pages/AboutUs.js
import React, { useEffect, useRef } from 'react';
import '../App.css';
import { gsap } from 'gsap';

function AboutUs() {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.set(textRef.current, { opacity: 0, x: -100 });
    gsap.set(imageRef.current, { opacity: 0, x: 100 });

    gsap.to(textRef.current, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.to(imageRef.current, {
      x: 0,
      opacity: 1,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });
  }, []); // runs every time AboutUs is mounted

  return (
    <div className="page-wrapper">
      <div className="aboutus-container">
        <div className="aboutus-text" ref={textRef}>
          <h2>About <span className="highlight">CareerCraft AI</span></h2>
          <p>
            CareerCraft AI is your smart AI-powered career partner — built to help students and professionals grow faster with personalized support.
          </p>
          <ul className="aboutus-points">
            <li>📄 Get AI-powered resume reviews and suggestions</li>
            <li>🎯 Receive curated job recommendations tailored to your skills</li>
            <li>📊 Identify skill gaps and learn exactly what to focus on</li>
            <li>🧠 Explore a personalized learning and growth roadmap</li>
            <li>🔒 Secure login, save jobs, and track your career progress</li>
          </ul>
        </div>

        <div className="aboutus-image" ref={imageRef}>
          <img
            src="https://studentsuccess.utk.edu/career/wp-content/uploads/sites/8/2024/08/ai_jobsearch_feature.png"
            alt="Career Assistant AI Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
