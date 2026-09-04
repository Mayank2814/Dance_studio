import React, { useState } from 'react';
import './HeroSection.css';
import { useNavigate } from "react-router-dom";

const slides = [
  {
    headline: ["DANCE", "FOR", "EVER"],
    sub: "Move with passion. Train with purpose. Dance forever.",
    slideNum: "01",
  },
  {
    headline: ["MOVE", "YOUR", "SOUL"],
    sub: "Where every step tells a story. Begin yours today.",
    slideNum: "02",
  },
  {
    headline: ["FEEL", "THE", "RHYTHM"],
    sub: "World-class instruction across every style and level.",
    slideNum: "03",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="ds-hero" id="home">
      {/* ── Left dark panel ── */}
      <div className="ds-hero__left">
        <div className="ds-hero__left-inner">
          {/* Brand mark */}
          <div className="ds-logo">
            <span className="ds-logo__box">D4E</span>
          </div>

          {/* Slide content */}
          <div className="ds-hero__copy" key={current}>
            <h2 className="ds-hero__slide-title">{slide.headline[0]}</h2>
            <div className="ds-hero__divider" />
            <p className="ds-hero__description">{slide.sub}</p>
            <button
              className="ds-hero__cta"
              onClick={() => navigate("/login")}
            >
              Read More
            </button>
          </div>

          {/* Social links */}
          <div className="ds-hero__social">
            <a href="#" className="ds-hero__social-link">facebook</a>
            <a href="#" className="ds-hero__social-link">twitter</a>
            <a href="#" className="ds-hero__social-link">instagram</a>
          </div>
        </div>

        {/* Carousel arrows */}
        <button className="ds-hero__arrow ds-hero__arrow--left" onClick={prev} aria-label="Previous slide">
          &#8249;
        </button>
        <button className="ds-hero__arrow ds-hero__arrow--right" onClick={next} aria-label="Next slide">
          &#8250;
        </button>
      </div>

      {/* ── Right light panel ── */}
      <div className="ds-hero__right">
        {/* Big background text */}
        <div className="ds-hero__bg-text" aria-hidden="true">
          {slide.headline.map((word, i) => (
            <span key={i} className="ds-hero__bg-word">{word}</span>
          ))}
        </div>

        {/* Dancer image — overlaps both panels */}
        <div className="ds-hero__dancer-wrap">
          <img
            src="/dancer_hero.jpg"
            alt="Professional dancer leaping"
            className="ds-hero__dancer-img"
            draggable={false}
          />
        </div>

        {/* Slide number */}
        <div className="ds-hero__slide-num" aria-hidden="true">{slide.slideNum}</div>

        {/* Dot indicators */}
        <div className="ds-hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`ds-hero__dot${i === current ? " ds-hero__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;