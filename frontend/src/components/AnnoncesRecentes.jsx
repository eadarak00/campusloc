import React, { useEffect, useState } from "react";

import "../styles/AnnoncesRecentes.css";
import AnnonceCard from "./bailleur/AnnonceCard";
import { getAnnoncesRecentes } from "../api/annonceAPI";

const AnnoncesRecentes = () => {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    const chargerAnnonces = async () => {
      try {
        const response = await getAnnoncesRecentes();
        setAnnonces(response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des annonces récentes :",
          error
        );
      }
    };

    chargerAnnonces();
  }, []);

  return (
    <section className="annonces-recentes-section container">
      <h2 className="annonces-recentes-title"></h2>
      <div className="annonces-recentes-grid">
        {annonces.map((annonce) => (
          <AnnonceCard key={annonce.id} annonce={annonce} />
        ))}
      </div>
    </section>
  );
};

export default AnnoncesRecentes;
