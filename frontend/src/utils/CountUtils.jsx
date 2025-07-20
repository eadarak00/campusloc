// src/utils

import { listerFavoris } from "../api/favorisAPI";

export const getNombreFavoris = async () => {
  const res = await listerFavoris();
  return res.data.length;
};
