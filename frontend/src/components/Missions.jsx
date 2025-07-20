import React from "react";
import { Handshake, Home, CreditCard, GraduationCap } from "lucide-react";
import "../styles/missions.css";

const missions = [
  {
    icon: <Handshake size={24} />,
    title: "Mise en relation fiable et rapide",
    description: "Connexion directe entre bailleurs et étudiants",
    iconClass: "campusloc-missions-item-icon-blue",
    titleClass: "campusloc-missions-item-title-blue",
  },
  {
    icon: <Home size={24} />,
    title: "Plateforme simple et efficace",
    description: "Interface intuitive pour une expérience fluide",
    iconClass: "campusloc-missions-item-icon-orange",
    titleClass: "campusloc-missions-item-title-orange",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Paiement sécurisé intégré",
    description: "Transactions protégées et transparentes",
    iconClass: "campusloc-missions-item-icon-green",
    titleClass: "campusloc-missions-item-title-green",
  },
  {
    icon: <GraduationCap size={24} />,
    title: "Pour favoriser la réussite étudiante",
    description: "Accompagnement dans la recherche de logement",
    iconClass: "campusloc-missions-item-icon-purple",
    titleClass: "campusloc-missions-item-title-purple",
  },
];

const Missions = () => {
  return (
    <section className="campusloc-missions-section container">
      <h2 className="campusloc-missions-title">
        Notre{" "}
        <span className="campusloc-missions-title-highlight">Mission</span>
      </h2>

      {/* <div className="campusloc-missions-container">
        <div className="campusloc-missions-grid">
          <div className="campusloc-missions-image-section">
            <div className="campusloc-missions-image-card">
              <div className="campusloc-missions-image-content">
                <div className="campusloc-missions-image-text">
                  <GraduationCap
                    size={96}
                    className="campusloc-missions-image-icon"
                  />
                  <h3 className="campusloc-missions-image-title">CampusLoc</h3>
                  <p className="campusloc-missions-image-subtitle">
                    Votre partenaire logement étudiant
                  </p>
                </div>
              </div>
            </div>

          </div> */}

      <div className="campusloc-missions-container">
        <div className="campusloc-missions-grid">
          <div className="campusloc-missions-image-section">
            <div className="campusloc-missions-image-card">
              <img
                src="/chemin/vers/ton-image.jpg"
                alt="CampusLoc"
                className="campusloc-missions-background-image"
              />
              <div className="campusloc-missions-overlay">
                <div className="campusloc-missions-image-text">
                  <GraduationCap
                    size={96}
                    className="campusloc-missions-image-icon"
                  />
                  <h3 className="campusloc-missions-image-title">CampusLoc</h3>
                  <p className="campusloc-missions-image-subtitle">
                    Votre partenaire logement étudiant
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu côté droit */}
          <div className="campusloc-missions-content-section">
            <div className="campusloc-missions-header">
              {/* <h2 className="campusloc-missions-title">
                Notre{" "}
                <span className="campusloc-missions-title-highlight">
                  Mission
                </span>
              </h2> */}
              <p className="campusloc-missions-description">
                CampusLoc est né pour simplifier l'accès au logement étudiant
                autour des campus. Nous mettons en relation bailleurs et
                étudiants dans un cadre{" "}
                <span className="campusloc-missions-description-highlight-secure">
                  sécurisé
                </span>
                ,{" "}
                <span className="campusloc-missions-description-highlight-clear">
                  clair
                </span>{" "}
                et{" "}
                <span className="campusloc-missions-description-highlight-human">
                  humain
                </span>
                .
              </p>
            </div>

            {/* Liste des missions */}
            <div className="campusloc-missions-list">
              {missions.map((mission, index) => (
                <div key={index} className="campusloc-missions-item">
                  <div
                    className={`campusloc-missions-item-icon ${mission.iconClass}`}
                  >
                    {mission.icon}
                  </div>
                  <div className="campusloc-missions-item-content">
                    <h3
                      className={`campusloc-missions-item-title ${mission.titleClass}`}
                    >
                      {mission.title}
                    </h3>
                    <p className="campusloc-missions-item-description">
                      {mission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Missions;
