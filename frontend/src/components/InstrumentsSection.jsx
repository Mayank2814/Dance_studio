import React from 'react';
import './InstrumentsSection.css';
import { useNavigate } from "react-router-dom";

const InstrumentsSection = () => {
  const navigate = useNavigate();
  const instruments = [
    {
      name: 'Ballet',
      icon: '🩰',
      description: 'Classical ballet technique, alignment, and artistry',
      level: 'All Levels',
      students: 45,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Hip Hop',
      icon: '🕺',
      description: 'Urban choreography, grooves, and freestyle foundations',
      level: 'Beginner to Advanced',
      students: 62,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Contemporary',
      icon: '💃',
      description: 'Modern and contemporary dance with expressive movement',
      level: 'All Levels',
      students: 28,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Jazz',
      icon: '🎷',
      description: 'Jazz technique, leaps, turns, and performance quality',
      level: 'Beginner to Intermediate',
      students: 19,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Salsa',
      icon: '🎶',
      description: 'Latin partner work, musicality, and footwork',
      level: 'All Levels',
      students: 34,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Ballroom',
      icon: '🤵‍♂️',
      description: 'Standard and Latin ballroom techniques and partnering',
      level: 'All Levels',
      students: 51,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="instruments-section">
      <div className="instruments-container">
        <div className="instruments-header">
          <h2 className="instruments-title">Our Dance Programs</h2>
          <p className="instruments-subtitle">
            Choose from our comprehensive range of dance styles and start your dance journey today
          </p>
        </div>

        <div className="instruments-grid">
          {instruments.map((instrument, index) => (
            <div key={index} className="instrument-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="instrument-header">
                <div className={`instrument-icon bg-gradient-to-br ${instrument.color}`}>
                  <span className="icon-main">{instrument.icon}</span>
                  <div className="icon-glow"></div>
                </div>
                <div className="instrument-stats">
                  <div className="stat-number">{instrument.students}</div>
                  <div className="stat-label">Students</div>
                </div>
              </div>

              <div className="instrument-content">
                <h3 className="instrument-name">{instrument.name}</h3>
                <p className="instrument-description">{instrument.description}</p>
                <div className="instrument-level">
                  <span className="level-badge">{instrument.level}</span>
                </div>
              </div>

              <div className="instrument-actions">
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Learn More
                </button>
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => navigate("/login")}
                >
                  Enroll
                </button>
              </div>

              <div className="instrument-decoration">
                <div className="decoration-line"></div>
                <div className="decoration-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="instruments-showcase">
          <div className="showcase-content">
            <h3>Professional Instruction</h3>
            <p>Learn from experienced dancers and educators who are passionate about sharing their knowledge and helping you achieve your dance goals.</p>
            <div className="showcase-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Personalized Learning Plans</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Regular Progress Assessments</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Performance Opportunities</span>
              </div>
            </div>
          </div>
          <div className="showcase-visual">
            <div className="floating-elements">
              <div className="floating-note note-1">♪</div>
              <div className="floating-note note-2">♫</div>
              <div className="floating-note note-3">♪</div>
              <div className="floating-note note-4">♫</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentsSection;