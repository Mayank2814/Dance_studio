import React from 'react';
import './FeaturesSection.css';
import { useNavigate } from "react-router-dom";

const FeaturesSection = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: '💃',
      title: 'Comprehensive Dance Curriculum',
      description: 'From beginner to advanced levels, our structured curriculum covers major dance styles and foundational technique.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description: 'Learn from professional dancers and educators with years of experience in dance education.',
      color: 'from-blue-500 to-teal-500'
    },
    {
      icon: '📅',
      title: 'Flexible Scheduling',
      description: 'Book lessons at your convenience with our advanced scheduling system and real-time availability.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎭',
      title: 'Performance Opportunities',
      description: 'Showcase your talent through regular recitals, concerts, and performance events throughout the year.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your dance journey with detailed progress reports and personalized feedback from instructors.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '📝',
      title: 'Practice Logs',
      description: 'Keep detailed records of your practice sessions and receive guidance to improve your technique effectively.',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <section id="features-section" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose Our Dance School?</h2>
          <p className="features-subtitle">
            Discover the perfect environment for your dance journey with our comprehensive dance education platform
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon-wrapper">
                <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>

        <div className="features-cta">
          <div className="cta-content">
            <h3>Ready to Start Your Dance Journey?</h3>
            <p>Join hundreds of students who have discovered their passion for dance with us.</p>
            <div className="cta-buttons">
              <button
                className="btn-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                <span className="btn-icon">💃</span>
                Enroll Now
              </button>
              <button
                className="btn-ghost btn-lg"
                onClick={() => {
                  window.location.href = "mailto:info@danceschool.com";
                }}
              >
                <span className="btn-icon">📞</span>
                Contact Us
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="music-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;