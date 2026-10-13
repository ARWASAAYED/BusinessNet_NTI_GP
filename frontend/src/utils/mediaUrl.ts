import { API_URL } from "./constants";

export const getMediaUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (/^https?:\/\//i.test(url)) return url;

  // Base backend server URL (stripping trailing /api/v1)
  let baseBackend = API_URL.replace(/\/api\/v1\/?$/, "");

  // If running in production on vercel, ensure backend URL is used
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("vercel.app") &&
    baseBackend.includes("businessnet-frontend")
  ) {
    baseBackend = "https://businessnet-backend.vercel.app";
  }

  if (url.startsWith("/")) {
    return `${baseBackend}${url}`;
  }

  return `${baseBackend}/${url}`;
};

