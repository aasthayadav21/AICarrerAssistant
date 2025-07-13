// src/pages/Home.js
import React, { useEffect, useRef } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import Chatbot from '../components/Chatbot';
import '../App.css';
import { gsap } from 'gsap';

function Home() {
  const introRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      introRef.current,
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="homepage-background">
      <div className="animated-bg" />
      <div className="homepage-intro" ref={introRef}>
        <h1>
          Level Up Your Career with <span>CareerCraft AI</span>
        </h1>
        <p>
          Upload your resume to get personalized job recommendations, skill gap analysis, and more — powered by AI.
        </p>
      </div>
      <ResumeUpload />
      <Chatbot />
    </div>
  );
}

export default Home;
