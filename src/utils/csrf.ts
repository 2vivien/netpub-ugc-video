let csrfToken: string | null = null;

interface EnvMeta {
  env: {
    VITE_API_URL?: string;
  };
}

export const fetchCsrfToken = async (maxRetries = 5, retryDelayMs = 1000): Promise<string> => {
  if (csrfToken) return csrfToken;

  // Add a small initial delay on the very first call to give the backend time to warm up
  // This avoids the noisy "ECONNREFUSED" logs in the terminal during startup.
  await new Promise(resolve => setTimeout(resolve, 3000));

  for (let i = 0; i < maxRetries; i++) {
    try {
      const apiUrl = (import.meta as unknown as EnvMeta).env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/csrf-token`);
      if (!response.ok) {
        // Retry on 5xx errors which often happen during startup/proxying
        if (response.status >= 500 && i < maxRetries - 1) {
          if (i >= 2) {
            
          }
          await new Promise(resolve => setTimeout(resolve, retryDelayMs));
          continue;
        }
        throw new Error(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken as string;
    } catch (error) {
      // Retry on network errors (like TypeError: Failed to fetch) during startup
      if (i < maxRetries - 1) {
        if (i >= 2) {
          
        }
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Failed to fetch CSRF token after multiple retries.');
};