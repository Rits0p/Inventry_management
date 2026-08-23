const FIELD_LABELS = {
  fullName: 'Full name',
  email: 'Email',
  password: 'Password',
};

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data || typeof data !== 'object') return fallback;
  if (typeof data.detail === 'string') return data.detail;
  const key = Object.keys(data)[0];
  if (!key) return fallback;
  const message = Array.isArray(data[key]) ? data[key][0] : data[key];
  if (typeof message !== 'string') return fallback;
  const label = FIELD_LABELS[key];
  return label ? `${label}: ${message}` : message;
}
