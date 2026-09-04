import React from 'react';
import './TestimonialsSection.css';
import { useNavigate } from "react-router-dom";

const TestimonialsSection = () => {
  const navigate = useNavigate();
  const testimonials = [
    {
      name: 'Sarah Johnson',
      instrument: 'Ballet',
      level: 'Advanced',
      image: '👩‍🎭',
      quote: 'The instructors here are incredible! I went from knowing nothing about ballet to performing in recitals. The personalized attention and structured curriculum made all the difference.',
      rating: 5,
      achievement: 'Performed in 3 school showcases'
    },
    {
      name: 'Michael Chen',
      instrument: 'Hip Hop',
      level: 'Intermediate',
      image: '👨‍🎭',
      quote: 'This school transformed my understanding of movement. The practice logs and feedback system helped me improve consistently. Now I can freestyle with real confidence!',
      rating: 5,
      achievement: 'Choreographed 3 group routines'
    },
    {
      name: 'Emily Rodriguez',
      instrument: 'Contemporary',
      level: 'Beginner to Intermediate',
      image: '💃',
      quote: 'Starting contemporary dance as an adult was intimidating, but the supportive environment and patient teachers made it so enjoyable. I\'ve grown so much in just one year.',
      rating: 5,
      achievement: 'Joined studio performance team'
    },
    {
      name: 'David Kim',
      instrument: 'Salsa',
      level: 'Advanced',
      image: '🕺',
      quote: 'The program here is outstanding. Professional techniques, regular performances, and a community of fellow dancers. Best decision I ever made!',
      rating: 5,
      achievement: 'Won local dance competition'
    }
  ];

  const stats = [
    { number: '98%', label: 'Student Satisfaction' },
    { number: '500+', label: 'Students Taught' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '1000+', label: 'Lessons Completed' }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Students Say</h2>
          <p className="testimonials-subtitle">
            Hear from our students about their dance journey and achievements
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="testimonial-header">
                <div className="student-avatar">
                  <span className="avatar-emoji">{testimonial.image}</span>
                </div>
                <div className="student-info">
                  <h4 className="student-name">{testimonial.name}</h4>
                  <p className="student-details">
                    {testimonial.instrument} • {testimonial.level}
                  </p>
                </div>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
              </div>

              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>

              <div className="testimonial-achievement">
                <span className="achievement-icon">🏆</span>
                <span className="achievement-text">{testimonial.achievement}</span>
              </div>

              <div className="testimonial-decoration">
                <div className="quote-mark">"</div>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-visual">
                  <div className="stat-bar">
                    <div className="stat-fill" style={{
                      width: stat.number.includes('%') ? stat.number : '85%',
                      animationDelay: `${index * 0.2}s`
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-cta">
          <div className="cta-card">
            <div className="cta-content">
              <h3>Ready to Join Our Dance Family?</h3>
              <p>Start your dance journey today and be part of our growing community of dancers.</p>
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-check">✓</span>
                  <span>Free trial lesson</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-check">✓</span>
                  <span>Flexible scheduling</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-check">✓</span>
                  <span>Expert instructors</span>
                </div>
              </div>
            </div>
            <div className="cta-actions">
              <button
                className="btn-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                <span className="btn-icon">💃</span>
                Book Free Trial
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
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;