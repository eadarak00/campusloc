import React from "react";
import "../styles/enConstruction.css";

const EnConstruction = ({ nomPage = "Cette page" }) => {
  return (
    <div className="construction-root">
      <div className="construction-container">
        <div className="construction-card-wrapper">
          <div className="construction-card">
            <div className="construction-shimmer"></div>
            
            <div className="construction-icon-container">
              <div className="construction-icon-circle">
                <span className="construction-icon">🚧</span>
              </div>
              <div className="construction-decorative-circle-1"></div>
              <div className="construction-decorative-circle-2"></div>
            </div>

            <h2 className="construction-title">{nomPage}</h2>
            
            <div className="construction-progress-container">
              <div className="construction-progress-bar"></div>
            </div>

            <p className="construction-main-text">
              La page <span className="construction-highlight">{nomPage}</span> est actuellement en construction.
            </p>
            
            <div className="construction-secondary-message">
              <span>⚡</span>
              <p className="construction-secondary-text">Notre équipe travaille dessus activement</p>
              <span>⚡</span>
            </div>


            <div className="construction-dots">
              <div className="construction-dot construction-dot-1"></div>
              <div className="construction-dot construction-dot-2"></div>
              <div className="construction-dot construction-dot-3"></div>
            </div>
          </div>

          <p className="construction-footer-text">
            Revenez bientôt pour découvrir les nouveautés ! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnConstruction;