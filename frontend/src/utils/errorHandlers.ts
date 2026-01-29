/**
 * Error handling utilities
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  field?: string;
}

/**
 * Parse API error response
 */
export const parseApiError = (error: any): ApiError => {
  // Axios error
  if (error.response) {
    return {
      message: error.response.data?.message || error.response.data?.error || 'An error occurred',
      code: error.response.data?.code,
      status: error.response.status,
      field: error.response.data?.field,
    };
  }
  
  // Network error
  if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }
  
  // Other errors
  return {
    message: error.message || 'An unexpected error occurred',
  };
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: ApiError): string => {
  const errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You don\'t have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
  };

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return error.message;
    }
  }

  return error.message;
};

/**
 * Log error to console (in development) or error tracking service (in production)
 */
export const logError = (error: any, context?: string): void => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Example: Sentry.captureException(error, { tags: { context } });
    console.error('Error occurred:', error.message);
  }
};

/**
 * Handle async errors with try-catch wrapper
 */
export const handleAsync = async <T>(
  promise: Promise<T>,
  errorMessage?: string
): Promise<[T | null, ApiError | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const apiError = parseApiError(error);
    if (errorMessage) {
      apiError.message = errorMessage;
    }
    logError(error);
    return [null, apiError];
  }
};

/**
 * Show error toast notification
 * This is a helper that can be used with a toast library
 */
export const showErrorToast = (error: ApiError | string, toastFn?: (message: string) => void): void => {
  const message = typeof error === 'string' ? error : getUserFriendlyMessage(error);
  
  if (toastFn) {
    toastFn(message);
  } else {
    // Fallback to console if no toast function provided
    console.error(message);
  }
};

/**
 * Retry failed request with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Check if error is a specific type
 */
export const isNetworkError = (error: ApiError): boolean => {
  return error.code === 'NETWORK_ERROR';
};

export const isAuthError = (error: ApiError): boolean => {
  return error.status === 401 || error.code === 'UNAUTHORIZED';
};

export const isValidationError = (error: ApiError): boolean => {
  return error.status === 400 || error.code === 'VALIDATION_ERROR';
};
