import { API_URL } from "./constants";

export const getMediaUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (/^https?:\/\//i.test(url)) return url;

  // Base backend server URL (stripping trailing /api/v1)
  const baseBackend = API_URL.replace(/\/api\/v1\/?$/, "");

  if (url.startsWith("/")) {
    return `${baseBackend}${url}`;
  }

  return `${baseBackend}/${url}`;
};

