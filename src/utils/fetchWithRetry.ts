/**
 * Fetch with retry logic: max 3 attempts with 3 second delay between retries
 * Returns the response if successful, otherwise throws error
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxAttempts: number = 3,
  delayMs: number = 3000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[fetchWithRetry] Attempt ${attempt}/${maxAttempts} for ${url}`);
      const response = await fetch(url, options);

      // Check for server errors that warrant retry (503, 502, 429)
      if (response.status === 503 || response.status === 502 || response.status === 429) {
        console.warn(`[fetchWithRetry] Got ${response.status} on attempt ${attempt}. Will retry...`);
        lastError = new Error(`HTTP ${response.status} - Service Unavailable`);
        
        // Don't delay after the last attempt
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        continue;
      }

      // For other status codes, throw immediately (don't retry)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Success - return response
      console.log(`[fetchWithRetry] ✓ Success on attempt ${attempt}`);
      return response;
    } catch (err) {
      console.warn(`[fetchWithRetry] Attempt ${attempt} error:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't delay after the last attempt
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // All retries failed
  console.error(`[fetchWithRetry] Failed after ${maxAttempts} attempts. Final error:`, lastError);
  throw lastError || new Error(`Failed after ${maxAttempts} retry attempts`);
}

/**
 * Delay helper for controlled retry intervals
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
