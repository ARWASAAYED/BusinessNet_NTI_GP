import { API_URL } from "./constants";

/**
 * Resolves a potentially relative media path to a full absolute URL pointing at the backend.
 *
 * The backend stores media URLs as "/api/v1/media/<id>".
 *
 * Strategy:
 * - On Vercel (production): route through Next.js /proxy/media/:id rewrite
 *   so the browser never makes a cross-origin request.
 * - Locally: prepend http://localhost:5000 (derived from API_URL).
 */
export const getMediaUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  // Blob and data URLs are preview-only — return as-is
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  // Already an absolute URL — return as-is
  if (/^https?:\/\//i.test(url)) return url;

  // In browser: route through Next.js /proxy/media/:id rewrite to ensure same-origin requests with zero CORS
  if (typeof window !== "undefined") {
    const mediaIdMatch = url.match(/\/media\/([a-f0-9]{24})/i);
    if (mediaIdMatch) {
      return `/proxy/media/${mediaIdMatch[1]}`;
    }
  }

  // Derive the backend origin from the configured API_URL
  // e.g. "http://localhost:5000/api/v1" → "http://localhost:5000"
  const baseBackend = API_URL.replace(/\/api\/v1\/?$/, "").replace(/\/api\/v1\/?$/, "");

  // Relative path starting with /
  if (url.startsWith("/")) {
    return `${baseBackend}${url}`;
  }

  return `${baseBackend}/${url}`;
};
