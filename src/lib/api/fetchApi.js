// Remove direct fetch - use server proxy instead
export async function fetchApi(url, apiKey = null, apiKeyHeader = "X-Api-Key", apiKeyPrefix = "") {
  const res = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      apiKey,
      apiKeyHeader,
      apiKeyPrefix,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}