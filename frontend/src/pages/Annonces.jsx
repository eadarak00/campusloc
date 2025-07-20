import React, { useEffect, useState } from "react";
import {
  getAnnoncesRecentes,
  getAnnoncesRecentesParType,
} from "../api/annonceAPI";
import AnnonceCard from "../components/bailleur/AnnonceCard";
import AnnoncesPopulaires from "../components/AnnoncePopulaire";
import "../styles/AnnoncesPage.css";
import { listerFavoris } from "../api/favorisAPI";

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
  const [idsFavoris, setIdsFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const res = await listerFavoris();
        const ids = res.data.map((favori) => favori.annonceId);

        setIdsFavoris(ids);
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
      }
    };

    fetchFavoris();
  }, []);

  useEffect(() => {
    const fetchAnnonces = async () => {
      setLoading(true);
      try {
        const resRecentes = await getAnnoncesRecentes();
        setAnnoncesRecentes(resRecentes.data);

        const annoncesTypes = {};
        for (const type of Object.keys(TYPES_LOGEMENT)) {
          try {
            const res = await getAnnoncesRecentesParType(type);
            if (res.data && res.data.length > 0) {
              annoncesTypes[type] = res.data;
            }
          } catch (err) {
            console.error(`Erreur pour le type ${type} :`, err);
          }
        }
        setAnnoncesParType(annoncesTypes);
      } catch (err) {
        console.error("Erreur chargement annonces :", err);
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
          <div className="ap-loading-spinner" />
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
            sélectionnées.
          </p>
        </div>
      </div>

      <AnnoncesPopulaires />

      {/* Annonces Récentes */}
      <section className="ap-annonces-section">
        <div className="ap-section-header">
          <h2 className="ap-section-title">Annonces récentes</h2>
          <div className="ap-section-line" />
        </div>
        <div className="ap-annonces-grid">
          {annoncesRecentes.map((annonce) => (
            <AnnonceCard
              key={annonce.id}
              annonce={annonce}
              isFavorite={idsFavoris.includes(annonce.id)}
              onFavoriteChange={(id, newValue) => {
                setIdsFavoris((prev) =>
                  newValue ? [...prev, id] : prev.filter((fid) => fid !== id)
                );
              }}
            />
          ))}
        </div>
      </section>

      {/* Annonces par Type */}
      {Object.entries(TYPES_LOGEMENT).map(([typeKey, label]) =>
        annoncesParType[typeKey] ? (
          <section key={typeKey} className="ap-annonces-section">
            <div className="ap-section-header">
              <h2 className="ap-section-title">Logements : {label}</h2>
              <div className="ap-section-line" />
            </div>
            <div className="ap-annonces-grid">
              {annoncesParType[typeKey].map((annonce) => (
                <AnnonceCard
                  key={annonce.id}
                  annonce={annonce}
                  isFavorite={idsFavoris.includes(annonce.id)}
                  onFavoriteChange={(id, newValue) => {
                    setIdsFavoris((prev) =>
                      newValue
                        ? [...prev, id]
                        : prev.filter((fid) => fid !== id)
                    );
                  }}
                />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
};

export default AnnoncesPage;
