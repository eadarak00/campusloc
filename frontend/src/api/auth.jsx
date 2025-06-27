// src/api/auth.js
import api from "./api";

export const login = (credentials) => 
  api.post("/v1/auth/connexion", {
    email: credentials.email,
    motDePasse: credentials.password
  });
export const register = (data) => api.post("/v1/auth/inscription", data);

export const validerCode = (data) => api.post("/v1/auth/valider", data);
