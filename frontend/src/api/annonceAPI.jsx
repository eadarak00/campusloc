// src/api/annonceApi
import api from "./api";

const ANNONCE_BASE = "/v1/annonces";

// Créer une annonce
export const createAnnonce = (data) => {
  return api.post(ANNONCE_BASE, data);
};

// Lister les annonces en attente pour un propriétaire
export const getAnnoncesEnAttentesParProprietaires = (proprietaireId) => {
  return api.get(`${ANNONCE_BASE}/proprietaire/${proprietaireId}/en-attente`);
};

// Lister les annonces en actives pour un propriétaire
export const getAnnoncesActivesParProprietaires = (proprietaireId) => {
  return api.get(`${ANNONCE_BASE}/proprietaire/${proprietaireId}/actifs`);
};


// recuperer un annonce de par son ID
export const getAnnonceById = (annonceId) =>{
  return api.get(`${ANNONCE_BASE}/${annonceId}`);
}

// modifier annonce de par son ID

export const updateAnnonce = (id, updatedData) => {
  return api.patch(`${ANNONCE_BASE}/${id}`, updatedData);
};

// supprimer annonce
export const deleteAnnonce = (annonceId) => {
  return api.delete(`${ANNONCE_BASE}/${annonceId}`);
}