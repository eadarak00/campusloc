// src/auth/

export const logout = () => {
  // Supprimer les données du localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_data");

};
