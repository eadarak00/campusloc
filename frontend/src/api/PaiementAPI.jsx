// src/api/PaiementAPI.js
import api from "./api";

const PAIEMENT_BASE = "/v1/paiements"

export const initierPaiement = async (contactId, operateur) => {
  return api.post(`${PAIEMENT_BASE}/initier/${contactId}`, {
    contactId,
    operateur
  });
};

export const validerPaiement = async (reference, contactId) => {
  return api.post(`${PAIEMENT_BASE}/valider`, 
    { reference, contactId }
  );
};
