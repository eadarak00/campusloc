import React from "react";
import "../styles/cardTemoignage.css";
import { FaQuoteLeft } from "react-icons/fa";

const CardTemoignage = ({ message, nom, role }) => {
  return (
    <div className="temoignage-card">
      <div className="temoignage-quote-icon">
        <FaQuoteLeft />
      </div>
      <p className="temoignage-message">{message}</p>
      <div className="temoignage-author">
        <span className="temoignage-author-name">— {nom}</span>
        <div className="temoignage-author-role">{role}</div>
      </div>
    </div>
  );
};

export default CardTemoignage;
