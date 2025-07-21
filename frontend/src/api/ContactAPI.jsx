// src/api/ContactAPI

import api from "./api";

const CONTACT_API = "/v1/contacts"

// 1. Débloquer les coordonnées d’une annonce (pour les prospects)
export const debloquerCoordonnees = async (annonceId) => {
  return api.post(`${CONTACT_API}/annonces/${annonceId}/coordonnees`);
};

// 2. Lister les contacts d’une annonce (pour les bailleurs)
export const listerContactsParAnnonce = async (annonceId) => {
  return api.get(`${CONTACT_API}/annonces/${annonceId}`);
};

// 3. Lister les annonces contactées par le prospect (lui-même)
export const listerContactsParProspect = async () => {
  return api.get(`${CONTACT_API}/mes-contacts`);
};

// 4. Lister les contacts pour toutes les annonces du bailleur
export const listerContactsDuBailleur = async () => {
  return api.get(`${CONTACT_API}/mes-annonces/contacts`);
};
