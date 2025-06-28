// src/api/auth.js
import api from "./api";

const AUTH_BASE = "/v1/auth";

export const login = (credentials) => 
  api.post(`${AUTH_BASE}/connexion`, {
    email: credentials.email,
    motDePasse: credentials.password
  });

export const register = (data) => 
  api.post(`${AUTH_BASE}/inscription`, data);

export const inscriptionBailleur = (data) => 
  api.post(`${AUTH_BASE}/inscription-bailleur`, data);

export const validerCode = (data) => 
  api.post(`${AUTH_BASE}/valider`, data);

export const checkEmailExists = (email) => 
  api.post(`${AUTH_BASE}/verifier-email`, { email });

export const resendCode = (email) => 
  api.post(`${AUTH_BASE}/renvoyer-code?email=${encodeURIComponent(email)}`);
