//src/api/favoris
import api from "./api";

const FAVORIS_BASE = "/v1/favoris";

// Ajouter une annonce aux favoris
export const ajouterFavori = async (annonceId) => {
  return api.post(`${FAVORIS_BASE}/${annonceId}`);
};

// Supprimer une annonce des favoris
export const supprimerFavori = async (annonceId) => {
  return api.delete(`/api/favoris/${annonceId}`);
};

// Lister les annonces favorites du prospect
export const listerFavoris = async () => {
   return api.get(`/api/favoris`);
};