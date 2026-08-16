// validators.js – Reusable form validation utilities

/**
 * Validate an email address format.
 */
export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

/**
 * Validate a password – minimum 6 characters.
 */
export const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 6;

/**
 * Validate that a required field is not empty.
 */
export const isRequired = (value) =>
  value !== null && value !== undefined && String(value).trim().length > 0;

/**
 * Validate that two values match (e.g., password confirmation).
 */
export const doValuesMatch = (a, b) => a === b;

/**
 * Validate that a number is positive.
 */
export const isPositiveNumber = (value) => Number(value) > 0;

/**
 * Validate an Indian phone number (10 digits, starting with 6-9).
 */
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

/**
 * Validate a PIN code (6 digits).
 */
export const isValidPinCode = (pin) => /^\d{6}$/.test(pin);
