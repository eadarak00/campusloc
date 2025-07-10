// src/utils/authUtils.js

/**
 * Récupère toutes les données utilisateur depuis le localStorage
 */
export const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem("user_data") || "{}");
  } catch (error) {
    console.error("Erreur lecture user_data:", error);
    return null;
  }
};

/**
 * Récupère uniquement l’ID de l’utilisateur
 */
export const getUserId = () => {
  const user = getUserData();
  return user?.userId || null;
};

/**
 * Vérifie si l'utilisateur connecté est un bailleur
 */
export const isBailleur = () => {
  const user = getUserData();
  return user?.role === "BAILLEUR";
};

/**
 * Retourne les données utilisateur uniquement si c'est un bailleur
 */
export const getBailleurFromStorage = () => {
  const user = getUserData();
  if (user?.role === "BAILLEUR") return user;
  return null;
};
