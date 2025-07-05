// src/api/annonce.js
import api from "./api";

const ANNONCE_BASE = "/v1/annonces";

// Créer une nouvelle annonce
export const createAnnonce = (data) => {
  return api.post(ANNONCE_BASE, data);
};
