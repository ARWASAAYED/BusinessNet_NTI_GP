import api from "./api";

const mediaService = {
  getMedia: async (id: string): Promise<Blob> => {
    const response = await api.get(`/media/${id}`, { responseType: "blob" });
    return response.data;
  },
};

export default mediaService;
