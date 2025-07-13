import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import './App.css';
import ResultsPage from './pages/ResultsPage';
import JobsPage from './components/JobsPage';
import SavedJobs from './components/SavedJobs';

function App() {
  return (
    <Router>
      <div className="layout">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path = "/results" element = {<ResultsPage/>} />
            <Route path="/jobs" element={<JobsPage/>} />
            <Route path="/saved-jobs" element={<SavedJobs/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
