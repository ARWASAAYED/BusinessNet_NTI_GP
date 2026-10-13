// API Constants
const getProductionBackendOrigin = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app')) {
      return 'https://businessnet-backend.vercel.app';
    }
    return window.location.origin;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://businessnet-backend.vercel.app'
    : 'http://localhost:5000';
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  `${getProductionBackendOrigin()}/api/v1`;

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || getProductionBackendOrigin();

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/profile',
  BUSINESS: '/business',
  COMMUNITIES: '/communities',
  MESSAGES: '/messages',
} as const;

// Post Categories
export const POST_CATEGORIES = [
  'Technology',
  'Business',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Real Estate',
  'Retail',
  'Manufacturing',
  'Services',
  'Other',
] as const;

// Pagination
export const POSTS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 20;
export const MESSAGES_PER_PAGE = 50;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  MESSAGE: 'message',
  COMMUNITY_INVITE: 'community_invite',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  BUSINESS: 'business',
  ADMIN: 'admin',
} as const;
