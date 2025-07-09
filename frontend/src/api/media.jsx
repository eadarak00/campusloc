//src/api/media
import api from "./api";

const MEDIA_BASE = "/v1/medias";

export const uploadMedias = (annonceId, formData) => {
  return api.post(`${MEDIA_BASE}/${annonceId}/uploads`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteMedia = async (imageId) => {
  return api.delete(`${MEDIA_BASE}/${imageId}`);
};
