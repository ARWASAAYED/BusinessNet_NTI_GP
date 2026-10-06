import { format, formatDistance, formatRelative, isValid } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

const getCurrentLocale = (customLocale?: string) => {
  if (customLocale === 'ar') return arSA;
  if (customLocale === 'en') return enUS;
  if (typeof window !== 'undefined') {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const lang = localStorage.getItem('mada-locale') || localStorage.getItem('businessnet-locale') || document.documentElement.lang;
    if (isRtl || lang === 'ar') return arSA;
  }
  return enUS;
};

const safeDate = (date: any): Date | null => {
  if (!date) return null;
  const d = new Date(date);
  return isValid(d) ? d : null;
};

export const formatDate = (date: string | Date | undefined | null, customLocale?: string): string => {
  const d = safeDate(date);
  const locale = getCurrentLocale(customLocale);
  if (!d) return locale === arSA ? 'مؤخراً' : 'Recently';
  return format(d, 'MMM d, yyyy', { locale });
};

export const formatDateTime = (date: string | Date | undefined | null, customLocale?: string): string => {
  const d = safeDate(date);
  const locale = getCurrentLocale(customLocale);
  if (!d) return locale === arSA ? 'مؤخراً' : 'Recently';
  return format(d, 'MMM d, yyyy h:mm a', { locale });
};

export const formatTimeAgo = (date: string | Date | undefined | null, customLocale?: string): string => {
  const d = safeDate(date);
  const locale = getCurrentLocale(customLocale);
  const isAr = locale === arSA;
  if (!d) return isAr ? 'مؤخراً' : 'recently';
  try {
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) {
      return isAr ? 'الآن' : 'just now';
    }
    if (diffMin < 60) {
      return isAr ? `منذ ${diffMin} دقيقة` : `${diffMin}m ago`;
    }
    if (diffHours < 24) {
      return isAr ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return isAr ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    }
    return formatDistance(d, new Date(), { addSuffix: true, locale });
  } catch {
    return isAr ? 'مؤخراً' : 'recently';
  }
};

export const formatRelativeTime = (date: string | Date | undefined | null): string => {
  const d = safeDate(date);
  const locale = getCurrentLocale();
  if (!d) return locale === arSA ? 'مؤخراً' : 'recently';
  try {
    return formatRelative(d, new Date(), { locale });
  } catch {
    return locale === arSA ? 'مؤخراً' : 'recently';
  }
};
