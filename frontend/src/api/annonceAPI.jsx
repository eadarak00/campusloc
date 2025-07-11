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

// valider annonce
export const acceptAnnonce = (annonceID) => {
  return api.patch(`${ANNONCE_BASE}/${annonceID}/valider`);
}

// valider une liste d'annonce
export const acceptAnnonces = () => {
  return api.post(`${ANNONCE_BASE}/valider`);
}

// refuser une annonce
export const refuseAnnonce = (annonceID) => {
  return api.patch(`${ANNONCE_BASE}/${annonceID}/refuser`);
}

//refuser une liste d'annonce
export const refuseAnnonces = () => {
  return api.post(`${ANNONCE_BASE}/refuser`)
}

// Toutes les annonces
export const getAllAnnonces = () => {
  return api.get(`${ANNONCE_BASE}`)
}

// Toutes les annonces actives
export const getAllActivesAnnonces = () => {
  return api.get(`${ANNONCE_BASE}/actifs`)
}

// Toutes les annonces Inactives
export const getAllInactivesAnnonces = () => {
  return api.get(`${ANNONCE_BASE}/inactifs`)
}

// Toutes les annonces en attentes
export const getPendingAnnonces = () => {
  return api.get(`${ANNONCE_BASE}/en-attente`)
}
