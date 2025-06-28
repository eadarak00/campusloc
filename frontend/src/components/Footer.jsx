import React, { useState } from 'react';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import '../styles/footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      // Logique d'abonnement à la newsletter
      console.log('Email soumis:', email);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Section gauche - Informations de contact */}
          <div className="footer-section">
            <h2 className="footer-title">CampusLoc</h2>
            
            <div className="contact-info">
              <div className="contact-item">
                <MdEmail className="contact-icon" size={20} />
                <span>Campusloc@example.com</span>
              </div>
              
              <div className="contact-item">
                <MdLocationOn className="contact-icon" size={20} />
                <span>Ziguinchor, Senegal</span>
              </div>
            </div>
          </div>
          
          {/* Section droite - Newsletter */}
          <div className="footer-section newsletter-section">
            <h3 className="newsletter-title">Newsletters</h3>
            <p className="newsletter-text">
              Abonnez-vous pour ne plus rater nos nouvelles offres
            </p>
            
            <div className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="newsletter-input"
              />
              <button
                onClick={handleSubmit}
                className="newsletter-button"
              >
                S'ABONNER
              </button>
            </div>
          </div>
        </div>
        
        {/* Section du bas - Réseaux sociaux et copyright */}
        <div className="footer-bottom">
          
          {/* Réseaux sociaux */}
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebookF className="social-icon" size={24} />
            </a>
            
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram className="social-icon" size={24} />
            </a>
            
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedinIn className="social-icon" size={24} />
            </a>
            
            <a href="#" className="social-link" aria-label="YouTube">
              <FaYoutube className="social-icon" size={24} />
            </a>
          </div>
          
          {/* Copyright */}
          <div className="copyright">
            © 2025 eadarak, all rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;