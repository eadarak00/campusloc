// src/api/annonce.js
// import api from "./api";

// const ANNONCE_BASE = "/v1/annonces";

// // Créer une nouvelle annonce
// export const createAnnonce = (data) => {
//   return api.post(ANNONCE_BASE, data);
// };

// export const getAnnoncesEnAttentesParProprietaires = (proprietaireId) => {
//   return api.get(`${ANNONCE_BASE}/proprietaire/${proprietaireId}/en-attente`);
// };

import api from "./api";

const ANNONCE_BASE = "/v1/annonces";

// 1️⃣ Créer une annonce
export const createAnnonce = (data) => {
  return api.post(ANNONCE_BASE, data);
};

// 2️⃣ Lister les annonces en attente pour un propriétaire
export const getAnnoncesEnAttentesParProprietaires = (proprietaireId) => {
  return api.get(`${ANNONCE_BASE}/proprietaire/${proprietaireId}/en-attente`);
};
