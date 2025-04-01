import React from 'react';
import Team from '../components/Team';
import './TeamPage.css';

const TeamPage = () => {
  return (
    <div className="team-page">
      <nav className="team-nav">
        <div className="nav-content">
          <h1>Financial Assistant Team</h1>
          <a href="/" className="back-button">
            <i className="fas fa-arrow-left"></i>
            Back to App
          </a>
        </div>
      </nav>
      <div className="team-page-content">
        <Team />
      </div>
    </div>
  );
};

export default TeamPage; 