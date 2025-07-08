// src/utils/imageHelper.js
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// export const getImageUrl = (relativePath) => {
//   if (!relativePath) return null;
//   return relativePath.startsWith("http") ? relativePath : `${BASE_URL}${relativePath}`;
// };

// Configuration de base
const BASE_URL = "http://localhost:8080";

export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // Si l'URL est déjà complète, la retourner
  if (relativePath.startsWith("http")) {
    return relativePath;
  }
  
  // Construire l'URL complète
  const fullUrl = `${BASE_URL}${relativePath}`;
  console.log("🔗 URL construite:", fullUrl);
  
  return fullUrl;
};