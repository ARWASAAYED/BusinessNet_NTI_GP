/**
 * Validation utilities for form inputs and data
 */

/**
 * Validates email address format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Returns object with isValid boolean and error message
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates phone number (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validates username (alphanumeric, underscore, hyphen, 3-20 chars)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validates required field
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validates that value is a number
 */
export const isNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== '';
};

/**
 * Validates that value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates file size (in bytes)
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validates file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Password strength calculator
 * Returns score from 0 (weak) to 4 (very strong)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  return labels[strength] || 'Very Weak';
};
