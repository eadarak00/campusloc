import React, { useEffect, useState } from "react";
import {
  getAnnoncesRecentes,
  getAnnoncesRecentesParType,
} from "../api/annonceAPI";
import AnnonceCard from "../components/bailleur/AnnonceCard";
import "../styles/AnnoncesPage.css";
import AnnoncesPopulaires from "../components/AnnoncePopulaire";

// Types de logement sans icônes
const TYPES_LOGEMENT = {
  CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
  CHAMBRE_PARTAGEE: "Chambre partagée",
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
};

const AnnoncesPage = () => {
  const [annoncesRecentes, setAnnoncesRecentes] = useState([]);
  const [annoncesParType, setAnnoncesParType] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true);

        const resRecentes = await getAnnoncesRecentes();
        setAnnoncesRecentes(resRecentes.data);

        for (const type of Object.keys(TYPES_LOGEMENT)) {
          try {
            const res = await getAnnoncesRecentesParType(type);
            if (res.data && res.data.length > 0) {
              setAnnoncesParType((prev) => ({
                ...prev,
                [type]: res.data,
              }));
            }
          } catch (err) {
            console.error(`Erreur pour le type ${type} :`, err);
          }
        }
      } catch (err) {
        console.error("Erreur chargement annonces récentes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  if (loading) {
    return (
      <div className="ap-container">
        <div className="ap-loading-container">
          <div className="ap-loading-spinner"></div>
          <p className="ap-loading-text">Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-container">
      {/* Hero */}
      <div className="ap-hero-section">
        <div className="ap-hero-content">
          <h1 className="ap-hero-title">
            Découvrez nos <span className="ap-highlight">logements</span>
          </h1>
          <p className="ap-hero-subtitle">
            Trouvez votre nouveau chez-vous parmi nos annonces soigneusement
            sélectionnées
          </p>
        </div>
      </div>
      <AnnoncesPopulaires />

      {/* Section Annonces récentes */}
      <section className="ap-annonces-section">
        <div className="ap-section-header">
          <h2 className="ap-section-title">Annonces récentes</h2>
          <div className="ap-section-line"></div>
        </div>

        <div className="ap-annonces-grid">
          {annoncesRecentes.map((annonce) => (
            <AnnonceCard key={annonce.id} annonce={annonce} />
          ))}
        </div>
      </section>

      {/* Sections par type de logement */}
      {Object.entries(TYPES_LOGEMENT).map(([typeKey, label]) =>
        annoncesParType[typeKey] && annoncesParType[typeKey].length > 0 ? (
          <section key={typeKey} className="ap-annonces-section">
            <div className="ap-section-header">
              <h2 className="ap-section-title">Logements : {label}</h2>
              <div className="ap-section-line"></div>
            </div>

            <div className="ap-annonces-grid container">
              {annoncesParType[typeKey].map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
};

export default AnnoncesPage;
