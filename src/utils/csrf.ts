/**
 * CSRF protection disabled for Vercel deployment.
 * This utility now returns an empty string to avoid breaking existing components.
 */

export const fetchCsrfToken = async (): Promise<string> => {
  return "";
};
