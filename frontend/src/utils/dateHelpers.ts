import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatTimeAgo = (date: string | Date): string => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatRelative(new Date(date), new Date());
};
