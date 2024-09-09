import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Landing.css'

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo" onClick={openModal}>
          <span>SafeSt</span><span className="highlight">rides</span>
        </div>
        <div className="login-btn">
          <Link to='/login'>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero" style={{display:"flex",flexDirection:'column'}}>
        <h1>Welcome to SafeStrides</h1>
        <p className="text1">Your go-to platform for crime data and safety insights.</p>
        <p className="text2">Explore our interactive maps and stay informed to make safer decisions.</p>
        <a href="map.html" className="start-btn">Let's Get Started</a>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Project Overview</div>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <p>SafeStrides is designed to enhance safety and awareness by providing detailed insights into crime data. This platform integrates real-time data with user-friendly maps to help you navigate safely.</p>
              <ul>
                <li><strong>Real-Time Data:</strong> Stay updated with the latest crime statistics and alerts.</li>
                <li><strong>Interactive Maps:</strong> Visualize crime hotspots and trends in your area.</li>
                <li><strong>User-Friendly Interface:</strong> Easily access information and make informed decisions.</li>
              </ul>
              <p>Our goal is to empower users with accurate information and tools to improve their safety and security. Whether you're exploring new areas or monitoring your local community, SafeStrides is here to support you.</p>
              <h3>Project Impacts:</h3>
              <ul>
                <li><strong>Increased Awareness:</strong> Users will be more aware of crime patterns and potential dangers in their surroundings.</li>
                <li><strong>Enhanced Safety:</strong> By visualizing crime data, users can make safer choices about where to go and when.</li>
                <li><strong>Community Engagement:</strong> Encourages community involvement in safety measures and crime prevention efforts.</li>
                <li><strong>Data-Driven Decisions:</strong> Helps local authorities and organizations make data-driven decisions to enhance public safety.</li>
              </ul>
              <p>SafeStrides aims to be a valuable tool for individuals and communities alike, providing insights and fostering safer environments for all.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
