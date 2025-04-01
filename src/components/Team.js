import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Team.css';

// Import images
import ratndeepPhoto from '../assets/rtndip.png';
import tejasPhoto from '../assets/Tejas.jpg';
import omkarPhoto from '../assets/Onkar.jpg';
import shrikrishnaPhoto from '../assets/shrii.png';

const teamMembers = [
  {
    name: "Ratndeep Gurav",
    role: "Machine Learning Engineer",
    college: "Genba Sopanrao Moze College Of Engineering",
    photo: ratndeepPhoto,
    social: {
      linkedin: "https://www.linkedin.com/in/ratnadeep-gurav/",
      github: "https://github.com/ratnadeepgurav",
      email: "deepgurav2329@gmail.com"
    }
  },
  {
    name: "Tejas Nikam",
    role: "Full Stack Developer",
    college: "Genba Sopanrao Moze College Of Engineering",
    photo: tejasPhoto,
    social: {
      linkedin: "https://www.linkedin.com/in/tejasnikam2109/",
      github: "https://github.com/Tejascodes21",
      email: "tejasnikam2109@gmail.com"
    }
  },
  {
    name: "Omkar Tagade",
    role: "Java Developer",
    college: "Genba Sopanrao Moze College Of Engineering",
    photo: omkarPhoto,
    social: {
      linkedin: "https://www.linkedin.com/in/omkar-tagade-575a6231a",
      github: "https://github.com/Omkar-Tagade",
      email: "omkartagade145@gmail.com"
    }
  },
  {
    name: "Shrikrishna Sutar",
    role: "MERN Stack Developer",
    college: "Genba Sopanrao Moze College Of Engineering",
    photo: shrikrishnaPhoto,
    social: {
      linkedin: "https://www.linkedin.com/in/shrikrishna-sutar-3b601524b/",
      github: "https://github.com/Skrishna0703",
      email: "shrikrishnasutar0703@gmail.com"
    }
  }
];

const Team = () => {
  const navigate = useNavigate();

  return (
    <div className="team-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Home
      </button>
      <div className="team-header">
        <h2>Our Team</h2>
        <p>Meet the brilliant minds behind the Financial Assistant</p>
      </div>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="member-photo">
              <img src={member.photo} alt={member.name} />
              <div className="member-overlay">
                <div className="social-links">
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaLinkedin />
                  </a>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="social-link">
                    <FaGithub />
                  </a>
                  <a href={`mailto:${member.social.email}`} className="social-link">
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <div className="domain">{member.role}</div>
              <p className="college">{member.college}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team; 