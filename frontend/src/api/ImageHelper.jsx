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

  return fullUrl;
};
